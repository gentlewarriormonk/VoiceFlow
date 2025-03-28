# Project Structure for AI Task Manager

## Overview
This document outlines the folder and file structure for the AI Task Manager application, which consists of a Next.js frontend and an Express backend.

## Root Structure
```
ai-task-agent/
├── client/                 # Next.js frontend application
├── server/                 # Express backend application
├── docs/                   # Project documentation
│   ├── vision_statement.md
│   ├── user_stories.md
│   ├── product_requirements_document.md
│   └── system_architecture.md
└── README.md               # Project overview and setup instructions
```

## Frontend Structure (client/)
```
client/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (buttons, inputs, etc.)
│   │   ├── layout/         # Layout components (header, footer, etc.)
│   │   └── views/          # Page-specific components
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes for frontend
│   │   ├── _app.js         # Custom App component
│   │   ├── _document.js    # Custom Document component
│   │   ├── index.js        # Home page
│   │   └── [...].js        # Other pages
│   ├── styles/             # Global styles and theme
│   ├── utils/              # Utility functions
│   ├── services/           # API service functions
│   │   ├── voice/          # Voice processing services
│   │   ├── ai/             # AI processing services
│   │   └── tasks/          # Task management services
│   └── types/              # TypeScript type definitions
├── .env.local              # Environment variables (local)
├── .env.production         # Environment variables (production)
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Backend Structure (server/)
```
server/
├── src/
│   ├── api/                # API routes
│   │   ├── voice/          # Voice processing endpoints
│   │   ├── ai/             # AI processing endpoints
│   │   ├── tasks/          # Task management endpoints
│   │   └── webhooks/       # Webhook endpoints for n8n
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   │   ├── voice/          # Voice transcription service
│   │   ├── ai/             # AI processing service
│   │   ├── database/       # Database service (Airtable/Notion)
│   │   └── automation/     # n8n automation service
│   ├── utils/              # Utility functions
│   └── app.js              # Express application setup
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Documentation Structure (docs/)
```
docs/
├── vision_statement.md             # Project vision
├── user_stories.md                 # User stories
├── product_requirements_document.md # PRD
├── system_architecture.md          # System architecture diagram
├── api/                            # API documentation
├── database/                       # Database schema documentation
└── deployment/                     # Deployment instructions
```

## Module Breakdown

### Voice Transcription Module
- Location: `client/src/services/voice/` and `server/src/services/voice/`
- Purpose: Handle microphone input, audio preprocessing, and speech-to-text conversion
- Key files:
  - `VoiceRecorder.ts` - Manages microphone access and recording
  - `AudioProcessor.ts` - Handles audio preprocessing
  - `WhisperService.ts` - Integrates with Whisper API for transcription

### AI Processing Module
- Location: `client/src/services/ai/` and `server/src/services/ai/`
- Purpose: Process natural language, extract intents and entities
- Key files:
  - `GeminiService.ts` - Integrates with Gemini 2.5 API
  - `IntentRecognizer.ts` - Identifies user intentions from text
  - `EntityExtractor.ts` - Extracts key information (dates, priorities, etc.)
  - `ContextManager.ts` - Maintains conversation context

### Task Database Module
- Location: `server/src/services/database/`
- Purpose: Manage task data in Airtable or Notion
- Key files:
  - `DatabaseService.ts` - Abstract database interface
  - `AirtableService.ts` - Airtable-specific implementation
  - `NotionService.ts` - Notion-specific implementation
  - `SyncManager.ts` - Handles data synchronization

### UI Module
- Location: `client/src/components/`
- Purpose: Provide user interface for task management
- Key components:
  - `TaskList.tsx` - Displays list of tasks
  - `TaskDetail.tsx` - Shows detailed task information
  - `VoiceCommandBar.tsx` - Interface for voice input
  - `DailyView.tsx`, `WeeklyView.tsx`, `PriorityView.tsx` - Different task visualizations

### Automation Module
- Location: `server/src/services/automation/`
- Purpose: Integrate with n8n for task automation
- Key files:
  - `N8nService.ts` - Manages n8n workflow integration
  - `WorkflowTemplates.ts` - Predefined automation workflows
  - `WebhookHandler.ts` - Processes incoming webhook requests

### Smart Agent Module
- Location: `server/src/services/agent/`
- Purpose: Provide proactive task management
- Key files:
  - `DailyPlanner.ts` - Generates daily task summaries
  - `PriorityOptimizer.ts` - Suggests task reprioritization
  - `ConflictDetector.ts` - Identifies scheduling conflicts
  - `ProductivityAnalyzer.ts` - Analyzes user productivity patterns
