# AI Task Manager

A voice-activated, AI-powered task manager that allows users to create, manage, and organize tasks using natural language voice commands.

## Features

- Voice input for task management using Whisper API
- Natural language processing with Gemini 2.5 AI
- Task automation with n8n
- Task storage in Airtable/Notion
- Responsive web and mobile interface
- Smart agent for proactive task management

## Project Structure

The application consists of:

- **Frontend**: Next.js application for web and mobile interfaces
- **Backend**: Express server for API endpoints and business logic
- **Documentation**: Comprehensive project documentation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Airtable or Notion account
- n8n instance
- API keys for Whisper and Gemini 2.5

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/ai-task-agent.git
cd ai-task-agent
```

2. Install dependencies for both frontend and backend
```
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables
   - Create `.env.local` in the client directory
   - Create `.env` in the server directory
   - Add necessary API keys and configuration

4. Start the development servers
```
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend server
cd client
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Documentation

For more detailed information, see the documentation in the `docs` directory:

- [Vision Statement](./docs/vision_statement.md)
- [User Stories](./docs/user_stories.md)
- [Product Requirements Document](./docs/product_requirements_document.md)
- [System Architecture](./docs/system_architecture.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
