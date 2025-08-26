import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage as dataStorage } from "./storage";
import { insertDocumentSchema } from "@shared/schema";
import { transcribeAudio, extractRequirementsFromTranscript, calculateConfidenceScore } from "./services/gemini";
import { generatePDF, generateDOCX, countWords } from "./services/documentGenerator";

// Configure multer for file uploads
const multerStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/quicktime'];
    const allowedExtensions = ['.mp4', '.mov'];
    
    const hasValidMimeType = allowedTypes.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (hasValidMimeType || hasValidExtension) {
      cb(null, true);
    } else {
      console.warn(`⚠️ File type warning: ${file.mimetype} for ${file.originalname}`);
      cb(null, true); // Allow upload but log warning
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple upload endpoint for testing
  app.post("/api/documents/upload", upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        console.error("❌ No file in upload request");
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      console.log("✅ File uploaded:", req.file.path);
      
      // Create document record
      console.log("Creating document record...");
      const document = await dataStorage.createDocument({
        title: req.body.title || req.file.originalname,
        filename: req.file.originalname,
        fileSize: req.file.size,
        status: "processing",
        processingStage: "audio_extraction",
        duration: null,
        transcript: null,
        brdContent: null,
        wordCount: null,
        confidenceScore: null,
        processingTime: null,
      });

      console.log("Document created:", document.id);

      // Start processing asynchronously
      processVideoFile(document.id, req.file.path).catch(error => {
        console.error("Processing error for document", document.id, ":", error);
      });

      res.json({ 
        message: 'Upload successful', 
        file: req.file.filename,
        document: document
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await dataStorage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error("Get document error:", error);
      res.status(500).json({ message: "Failed to get document" });
    }
  });

  // Get recent documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await dataStorage.getRecentDocuments(10);
      res.json(documents);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Failed to get documents" });
    }
  });

  // Download document as PDF
  app.get("/api/documents/:id/download/pdf", async (req, res) => {
    try {
      const document = await dataStorage.getDocument(req.params.id);
      if (!document || !document.brdContent) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      const outputPath = path.join('temp', `${document.id}.pdf`);
      await fs.promises.mkdir('temp', { recursive: true });
      await generatePDF(document.brdContent as any, outputPath);

      res.download(outputPath, `${document.title}.pdf`, (err) => {
        if (err) {
          console.error("Download error:", err);
        }
        // Clean up temp file
        fs.unlink(outputPath, () => {});
      });
    } catch (error) {
      console.error("PDF download error:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Download document as DOCX
  app.get("/api/documents/:id/download/docx", async (req, res) => {
    try {
      const document = await dataStorage.getDocument(req.params.id);
      if (!document || !document.brdContent) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      const outputPath = path.join('temp', `${document.id}.docx`);
      await fs.promises.mkdir('temp', { recursive: true });
      await generateDOCX(document.brdContent as any, outputPath);

      res.download(outputPath, `${document.title}.docx`, (err) => {
        if (err) {
          console.error("Download error:", err);
        }
        // Clean up temp file
        fs.unlink(outputPath, () => {});
      });
    } catch (error) {
      console.error("DOCX download error:", error);
      res.status(500).json({ message: "Failed to generate DOCX" });
    }
  });

  // Processing function (runs asynchronously)
  async function processVideoFile(documentId: string, filePath: string) {
    const startTime = Date.now();
    
    try {
      console.log(`Starting processing for document ${documentId}, file: ${filePath}`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Upload file not found: ${filePath}`);
      }

      // Update status to audio extraction
      console.log(`Updating status to audio extraction for ${documentId}`);
      await dataStorage.updateDocument(documentId, {
        status: "processing",
        processingStage: "audio_extraction",
      });

      // Extract audio (simplified - in real implementation would use ffmpeg)
      // For now, assume the video file is the audio file
      const audioPath = filePath;

      // Update status to transcription
      console.log(`Updating status to transcription for ${documentId}`);
      await dataStorage.updateDocument(documentId, {
        processingStage: "transcription",
      });

      // Transcribe audio
      console.log(`Starting transcription for ${documentId}`);
      const { text: transcript, duration } = await transcribeAudio(audioPath);
      console.log(`Transcription completed for ${documentId}, length: ${transcript.length} chars`);

      // Update status to NLP analysis
      await dataStorage.updateDocument(documentId, {
        processingStage: "nlp_analysis",
        transcript,
        duration,
      });

      // Extract requirements using Gemini
      const brdContent = await extractRequirementsFromTranscript(transcript);

      // Update status to BRD generation
      await dataStorage.updateDocument(documentId, {
        processingStage: "brd_generation",
      });

      // Calculate metrics
      const wordCount = countWords(transcript);
      const confidenceScore = await calculateConfidenceScore(transcript, brdContent);
      const processingTime = Math.round((Date.now() - startTime) / 1000);

      // Mark as completed
      await dataStorage.updateDocument(documentId, {
        status: "completed",
        processingStage: "completed",
        brdContent,
        wordCount,
        confidenceScore,
        processingTime,
      });

      // Clean up uploaded file
      fs.unlink(filePath, () => {});

    } catch (error) {
      console.error("Processing error:", error);
      await dataStorage.updateDocument(documentId, {
        status: "failed",
        processingStage: "failed",
      });
      
      // Clean up uploaded file
      fs.unlink(filePath, () => {});
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
