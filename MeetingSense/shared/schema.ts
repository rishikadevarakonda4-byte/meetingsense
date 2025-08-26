import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  fileSize: integer("file_size").notNull(),
  duration: integer("duration"), // in seconds
  status: text("status").notNull().default("uploading"), // uploading, processing, completed, failed
  processingStage: text("processing_stage").default("upload"), // upload, audio_extraction, transcription, nlp_analysis, brd_generation
  transcript: text("transcript"),
  brdContent: json("brd_content"),
  wordCount: integer("word_count"),
  confidenceScore: integer("confidence_score"), // 0-100
  processingTime: integer("processing_time"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const processingStages = pgTable("processing_stages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  stage: text("stage").notNull(), // audio_extraction, transcription, nlp_analysis, brd_generation
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProcessingStageSchema = createInsertSchema(processingStages).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertProcessingStage = z.infer<typeof insertProcessingStageSchema>;
export type ProcessingStage = typeof processingStages.$inferSelect;

// BRD Content Schema
export const brdContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  projectOverview: z.string(),
  businessObjectives: z.array(z.string()),
  scope: z.object({
    inScope: z.array(z.string()),
    outOfScope: z.array(z.string()),
  }),
  functionalRequirements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(["high", "medium", "low"]),
  })),
  nonFunctionalRequirements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
  })),
  stakeholders: z.array(z.object({
    name: z.string(),
    role: z.string(),
    responsibility: z.string(),
  })),
  constraints: z.array(z.string()),
  assumptions: z.array(z.string()),
});

export type BRDContent = z.infer<typeof brdContentSchema>;
