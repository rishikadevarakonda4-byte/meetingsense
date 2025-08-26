# Meeting Video to BRD Generator

## Overview

This is a full-stack web application that transforms business meeting videos into structured Business Requirements Documents (BRDs) using AI-powered analysis. Users can upload meeting recordings in various formats (MP4, MOV, AVI), and the system automatically extracts audio, transcribes speech, analyzes content using natural language processing, and generates professional BRD documents in PDF and DOCX formats.

The application serves as an intelligent business analysis tool, automating the traditionally manual process of creating requirements documentation from meeting discussions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **File Upload**: React Dropzone for drag-and-drop video file uploads
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **File Processing**: Multer middleware for handling multipart/form-data uploads
- **Storage**: In-memory storage implementation with interface for future database migration
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Current**: In-memory storage using Map data structures for rapid prototyping
- **Schema**: Drizzle ORM with PostgreSQL schema definitions for future database implementation
- **Models**: Documents and ProcessingStages tables with proper relationships and constraints

### AI Processing Pipeline
- **Speech-to-Text**: Google Gemini 2.5 Pro for audio transcription with multimodal capabilities
- **NLP Analysis**: Google Gemini 2.5 Pro for extracting business requirements from transcripts
- **Document Generation**: Custom PDF and DOCX generators with structured BRD formatting
- **Processing Stages**: Multi-step workflow (audio extraction → transcription → analysis → generation)

### Authentication and Authorization
- **Current**: No authentication implemented (suitable for internal/demo use)
- **Session Management**: Express session configuration prepared for future implementation
- **Security**: Basic file type validation and size limits for uploads

## External Dependencies

### AI Services
- **Google Gemini API**: Complete AI processing pipeline using Gemini 2.5 Pro for both audio transcription and natural language processing to extract business requirements

### Database
- **Neon Database**: Serverless PostgreSQL configured via connection string
- **Drizzle ORM**: Type-safe database operations with migration support

### UI Components
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Comprehensive icon library with consistent styling
- **Date-fns**: Date manipulation and formatting utilities

### Development Tools
- **Replit Integration**: Development environment optimization with error overlay and cartographer
- **ESBuild**: Fast TypeScript compilation for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility