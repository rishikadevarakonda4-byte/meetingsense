import { type Document, type InsertDocument, type ProcessingStage, type InsertProcessingStage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  getRecentDocuments(limit?: number): Promise<Document[]>;
  
  // Processing stage operations
  createProcessingStage(stage: InsertProcessingStage): Promise<ProcessingStage>;
  getProcessingStages(documentId: string): Promise<ProcessingStage[]>;
  updateProcessingStage(id: string, updates: Partial<ProcessingStage>): Promise<ProcessingStage | undefined>;
}

export class MemStorage implements IStorage {
  private documents: Map<string, Document>;
  private processingStages: Map<string, ProcessingStage>;

  constructor() {
    this.documents = new Map();
    this.processingStages = new Map();
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id,
      createdAt: now,
      updatedAt: now,
      status: insertDocument.status ?? "uploading",
      duration: insertDocument.duration ?? null,
      processingStage: insertDocument.processingStage ?? "upload",
      transcript: insertDocument.transcript ?? null,
      brdContent: insertDocument.brdContent ?? null,
      wordCount: insertDocument.wordCount ?? null,
      confidenceScore: insertDocument.confidenceScore ?? null,
      processingTime: insertDocument.processingTime ?? null,
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument: Document = {
      ...document,
      ...updates,
      updatedAt: new Date(),
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async getRecentDocuments(limit = 10): Promise<Document[]> {
    return Array.from(this.documents.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createProcessingStage(insertStage: InsertProcessingStage): Promise<ProcessingStage> {
    const id = randomUUID();
    const stage: ProcessingStage = { 
      ...insertStage, 
      id,
      status: insertStage.status ?? "pending",
      startedAt: null,
      completedAt: null,
      errorMessage: null,
    };
    this.processingStages.set(id, stage);
    return stage;
  }

  async getProcessingStages(documentId: string): Promise<ProcessingStage[]> {
    return Array.from(this.processingStages.values())
      .filter(stage => stage.documentId === documentId);
  }

  async updateProcessingStage(id: string, updates: Partial<ProcessingStage>): Promise<ProcessingStage | undefined> {
    const stage = this.processingStages.get(id);
    if (!stage) return undefined;
    
    const updatedStage: ProcessingStage = {
      ...stage,
      ...updates,
    };
    this.processingStages.set(id, updatedStage);
    return updatedStage;
  }
}

export const storage = new MemStorage();
