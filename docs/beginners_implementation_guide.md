# Beginner's Implementation Guide for VoiceFlow
## Version: 1.0
## Date: March 28, 2025

This guide provides step-by-step instructions for implementing the VoiceFlow application with minimal coding knowledge.

## Prerequisites

Before starting, ensure you have:
- A computer with internet access
- Basic familiarity with using command line/terminal
- GitHub account (free)
- Patience and willingness to learn

## Step 1: Set Up Your Development Environment

### Install Required Software

1. **Install Node.js**
   - Go to https://nodejs.org/
   - Download and install the LTS (Long Term Support) version
   - Verify installation by opening a terminal/command prompt and typing:
     ```
     node --version
     npm --version
     ```
   - Both commands should display version numbers

2. **Install Git**
   - Go to https://git-scm.com/downloads
   - Download and install the version for your operating system
   - Verify installation by opening a terminal/command prompt and typing:
     ```
     git --version
     ```
   - This should display the Git version number

3. **Install Cursor Editor**
   - Go to https://cursor.sh/
   - Download and install Cursor for your operating system
   - This AI-powered code editor will help you understand and modify the code

## Step 2: Download and Set Up the Project

### Clone the Project

1. **Create a GitHub Repository**
   - Go to GitHub.com and sign in
   - Click the "+" icon in the top right and select "New repository"
   - Name it "voiceflow"
   - Choose "Public" or "Private" (your preference)
   - Click "Create repository"

2. **Upload the Project Files**
   - In the new repository, click "uploading an existing file"
   - Upload the ZIP file containing the VoiceFlow project
   - Alternatively, you can use GitHub Desktop for a more user-friendly experience

3. **Clone the Repository Locally**
   - Open a terminal/command prompt
   - Navigate to where you want to store the project
   - Run:
     ```
     git clone https://github.com/YOUR_USERNAME/voiceflow.git
     cd voiceflow
     ```

## Step 3: Set Up API Keys

You'll need to create accounts and get API keys for several services:

### 1. OpenAI API (for Whisper voice transcription)
   - Go to https://platform.openai.com/signup
   - Create an account and add payment information
   - Navigate to API Keys and create a new secret key
   - Copy this key for later use

### 2. Google Cloud API (for text-to-speech)
   - Go to https://cloud.google.com/
   - Create an account (requires credit card but offers free tier)
   - Create a new project
   - Enable the Text-to-Speech API
   - Create an API key and copy it for later use

### 3. Google AI API (for Gemini)
   - Go to https://ai.google.dev/
   - Sign in with your Google account
   - Get an API key for Gemini
   - Copy this key for later use

### 4. Airtable (recommended for beginners)
   - Go to https://airtable.com/signup
   - Create an account
   - Create a new base using the template provided in `/docs/airtable_schema.json`
   - Get your API key from Account settings
   - Copy your Base ID from the API documentation

### 5. Create Environment Files
   - In the server directory, create a file named `.env`
   - Copy the contents from `.env.template` and fill in your API keys
   - In the client directory, create a file named `.env.local`
   - Copy the contents from `.env.template` and fill in your API keys

## Step 4: Install Dependencies

### Backend Setup

1. **Install Server Dependencies**
   - Open a terminal/command prompt
   - Navigate to the server directory:
     ```
     cd voiceflow/server
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - This may take a few minutes

### Frontend Setup

1. **Install Client Dependencies**
   - Open a new terminal/command prompt
   - Navigate to the client directory:
     ```
     cd voiceflow/client
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - This may take a few minutes

## Step 5: Run the Application Locally

### Start the Backend Server

1. **Run the Development Server**
   - In the terminal in the server directory, run:
     ```
     npm run dev
     ```
   - The server should start and display a message like "Server running on port 3001"
   - Keep this terminal open and running

### Start the Frontend Application

1. **Run the Development Server**
   - In the terminal in the client directory, run:
     ```
     npm run dev
     ```
   - The frontend should start and display a message with the local URL
   - Keep this terminal open and running

2. **Access the Application**
   - Open your web browser
   - Go to http://localhost:3000
   - You should see the VoiceFlow application interface

## Step 6: Test Basic Functionality

### Test Voice Recording

1. **Allow Microphone Access**
   - When prompted, allow the browser to access your microphone
   - Click the microphone button in the application
   - Speak a simple command like "Create a new task to buy groceries tomorrow"
   - The application should transcribe your speech and process the command

### Test Task Management

1. **Create a Task**
   - Use the voice command or type in the chatbot interface
   - Verify that the task appears in the task list
   - Try updating or completing the task

## Step 7: Customize the Application

### Basic Customization (No Coding Required)

1. **Update Branding**
   - Open `/client/src/components/common/Header.tsx` in Cursor
   - Change the application name or logo URL
   - Save the file and the changes should appear automatically

2. **Modify Voice Prompts**
   - Open `/server/src/services/ai/GeminiService.ts` in Cursor
   - Find the section with system prompts
   - Modify the text to change how the AI responds
   - Save the file and restart the server

## Step 8: Deploy the Application

### Option 1: Vercel (Easiest for Beginners)

1. **Deploy Frontend**
   - Create an account at https://vercel.com/
   - Install the Vercel CLI:
     ```
     npm install -g vercel
     ```
   - In the client directory, run:
     ```
     vercel
     ```
   - Follow the prompts to deploy

2. **Deploy Backend**
   - In the server directory, run:
     ```
     vercel
     ```
   - Follow the prompts to deploy
   - Set up the environment variables in the Vercel dashboard

3. **Connect Frontend to Backend**
   - In the Vercel dashboard, go to your frontend project
   - Add an environment variable `NEXT_PUBLIC_API_URL` with your backend URL
   - Redeploy the frontend

### Option 2: Railway (Simple Backend Deployment)

1. **Deploy Backend**
   - Create an account at https://railway.app/
   - Install the Railway CLI:
     ```
     npm install -g @railway/cli
     ```
   - In the server directory, run:
     ```
     railway up
     ```
   - Set up environment variables in the Railway dashboard

## Troubleshooting Common Issues

### API Connection Problems

1. **Check API Keys**
   - Verify all API keys are correctly entered in the `.env` files
   - Ensure there are no spaces or extra characters

2. **CORS Issues**
   - If you see CORS errors in the browser console, check that your backend URL is correctly set in the frontend

3. **Microphone Access**
   - If the microphone isn't working, check browser permissions
   - Try using Chrome, which has better support for audio APIs

### Deployment Issues

1. **Environment Variables**
   - Most deployment problems are related to missing environment variables
   - Double-check all required variables are set in your deployment platform

2. **Build Errors**
   - If the build fails, check the error logs in your deployment platform
   - Common issues include missing dependencies or incompatible versions

## Getting Help

If you encounter issues:

1. **Check Documentation**
   - Review the files in the `/docs` directory for detailed information

2. **Use Cursor AI**
   - Cursor's AI assistant can help explain code and suggest fixes
   - Highlight problematic code and ask for explanations

3. **Online Resources**
   - Search for specific error messages on Stack Overflow
   - Check the documentation for the specific API or service causing issues

## Next Steps for Learning

As you become more comfortable with the application:

1. **Learn Basic JavaScript/TypeScript**
   - Online courses like freeCodeCamp or Codecademy can help
   - Focus on understanding the basics of functions and objects

2. **Explore React Components**
   - The frontend uses React - learn how components work
   - Make small changes to the UI to practice

3. **Understand API Integrations**
   - Study how the application connects to external services
   - Try adding a new integration to extend functionality

Remember, learning to code is a journey. Take it one step at a time, and don't be afraid to make mistakes!
