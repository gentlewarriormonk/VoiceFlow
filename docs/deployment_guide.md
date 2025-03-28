# Deployment Guide for Voice-Activated AI Task Manager
## Version: 1.0
## Date: March 28, 2025

This document outlines the steps required to deploy the Voice-Activated AI Task Manager application to production environments.

## Prerequisites

Before deployment, ensure you have the following:

- Node.js 18.x or higher
- npm 9.x or higher
- Access to Airtable or Notion account
- Access to n8n instance
- API keys for:
  - OpenAI (Whisper API)
  - Google Cloud (Text-to-Speech API)
  - Google AI (Gemini API)
  - Airtable or Notion

## Backend Deployment

### 1. Environment Setup

Create a `.env` file in the server directory with the following variables:

```
# Server Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

# API Keys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
GEMINI_API_KEY=your_gemini_api_key

# Database Configuration
DATABASE_PROVIDER=airtable  # or notion
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
NOTION_API_KEY=your_notion_api_key
NOTION_TASKS_DATABASE_ID=your_notion_tasks_database_id
NOTION_PROJECTS_DATABASE_ID=your_notion_projects_database_id
NOTION_USER_ACTIVITY_DATABASE_ID=your_notion_user_activity_database_id
NOTION_DAILY_SUMMARIES_DATABASE_ID=your_notion_daily_summaries_database_id

# n8n Configuration
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com
```

### 2. Build the Backend

```bash
cd server
npm install
npm run build
```

### 3. Deploy to Server

#### Option 1: Traditional Server (e.g., AWS EC2, DigitalOcean)

1. Transfer the build files to your server
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

#### Option 2: Containerized Deployment (Docker)

1. Build the Docker image:
```bash
docker build -t ai-task-agent-server .
```

2. Run the container:
```bash
docker run -p 3001:3001 --env-file .env ai-task-agent-server
```

#### Option 3: Serverless Deployment (e.g., AWS Lambda, Vercel)

1. Configure the serverless deployment according to your provider's requirements
2. Deploy using the provider's CLI or web interface

## Frontend Deployment

### 1. Environment Setup

Create a `.env.production` file in the client directory with the following variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. Build the Frontend

```bash
cd client
npm install
npm run build
```

### 3. Deploy to Hosting Service

#### Option 1: Static Hosting (e.g., Netlify, Vercel)

1. Configure the deployment settings in your hosting provider
2. Deploy the build directory:
```bash
npm run deploy
```

#### Option 2: Traditional Server

1. Transfer the build files to your server
2. Configure your web server (Nginx, Apache) to serve the static files

## n8n Workflow Deployment

### 1. Import Workflows

1. Access your n8n instance
2. Import the workflow JSON files from the `docs/n8n_workflows` directory
3. Configure the webhook URLs to point to your deployed backend

### 2. Activate Workflows

1. Activate each workflow in the n8n interface
2. Test the workflows to ensure they're properly connected to your backend

## Database Setup

### Airtable Setup

1. Create a new Airtable base
2. Create tables according to the schema in `docs/airtable_schema.json`
3. Configure the appropriate API permissions

### Notion Setup

1. Create databases according to the schema in `docs/notion_schema.json`
2. Configure the integration and permissions in Notion

## Post-Deployment Verification

After deployment, perform the following checks:

1. Verify API connectivity between frontend and backend
2. Test voice transcription functionality
3. Test text-to-speech functionality
4. Verify task creation, updating, and deletion
5. Test n8n workflow triggers
6. Verify database operations

## Monitoring and Maintenance

1. Set up logging and monitoring for the application
2. Configure alerts for critical errors
3. Establish a backup strategy for the database
4. Plan for regular updates and maintenance

## Scaling Considerations

As user base grows, consider:

1. Implementing a caching layer (Redis, Memcached)
2. Setting up a load balancer for the backend
3. Optimizing database queries
4. Implementing rate limiting for API endpoints
5. Using a CDN for static assets

## Troubleshooting

Common issues and solutions:

1. **API Connection Issues**: Verify CORS settings and API URLs
2. **Voice Recognition Problems**: Check microphone permissions and API keys
3. **Database Connectivity**: Verify credentials and network access
4. **n8n Workflow Failures**: Check webhook URLs and authentication
