import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import App from '../../src/pages';
import useVoiceCommands from '../../src/hooks/useVoiceCommands';
import useChatbot from '../../src/hooks/useChatbot';
import useTasks from '../../src/hooks/useTasks';

// Mock the hooks
jest.mock('../../src/hooks/useVoiceCommands');
jest.mock('../../src/hooks/useChatbot');
jest.mock('../../src/hooks/useTasks');
jest.mock('../../src/hooks/useTextToSpeech');
jest.mock('../../src/hooks/useAIAssistant');

describe('End-to-End Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useVoiceCommands
    useVoiceCommands.mockImplementation(() => ({
      isListening: false,
      setIsListening: jest.fn(),
      transcript: '',
      isProcessing: false,
      commandResult: null,
      error: null,
      handleTranscription: jest.fn()
    }));
    
    // Mock useChatbot
    useChatbot.mockImplementation(() => ({
      messages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isProcessing: false,
      error: null,
      suggestedActions: [
        {
          type: "show_tasks",
          parameters: { timeframe: "today" },
          displayText: "Show today's tasks"
        }
      ],
      sendMessage: jest.fn(),
      executeAction: jest.fn()
    }));
    
    // Mock useTasks
    useTasks.mockImplementation(() => ({
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          dueDate: '2025-04-01',
          priority: 'high',
          status: 'in_progress',
          project: 'Marketing Campaign'
        },
        {
          id: '2',
          title: 'Team meeting',
          dueDate: '2025-03-29',
          time: '14:00',
          priority: 'medium',
          status: 'not_started',
          project: 'Internal'
        }
      ],
      loading: false,
      error: null,
      completeTask: jest.fn(),
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
  });

  it('renders the application with all main components', async () => {
    render(<App />);
    
    // Check if the main components are rendered
    expect(screen.getByText(/AI Task Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello! I'm your AI assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete project proposal/i)).toBeInTheDocument();
    expect(screen.getByText(/Team meeting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /microphone/i })).toBeInTheDocument();
  });

  it('allows task interaction', async () => {
    const mockCompleteTask = jest.fn();
    useTasks.mockImplementation(() => ({
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          dueDate: '2025-04-01',
          priority: 'high',
          status: 'in_progress',
          project: 'Marketing Campaign'
        }
      ],
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
    
    render(<App />);
    
    // Click the complete checkbox
    fireEvent.click(screen.getByRole('checkbox', { name: /mark as complete/i }));
    
    // Verify that completeTask was called with the correct task ID
    expect(mockCompleteTask).toHaveBeenCalledWith('1');
  });

  it('allows chatbot interaction', async () => {
    const mockSendMessage = jest.fn();
    useChatbot.mockImplementation(() => ({
      messages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isProcessing: false,
      error: null,
      suggestedActions: [],
      sendMessage: mockSendMessage,
      executeAction: jest.fn()
    }));
    
    render(<App />);
    
    // Type a message in the chatbot
    fireEvent.change(screen.getByPlaceholderText(/Type a message/i), {
      target: { value: 'Create a new task' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('form'));
    
    // Verify that sendMessage was called with the correct message
    expect(mockSendMessage).toHaveBeenCalledWith('Create a new task');
  });

  it('allows voice command interaction', async () => {
    const mockSetIsListening = jest.fn();
    useVoiceCommands.mockImplementation(() => ({
      isListening: false,
      setIsListening: mockSetIsListening,
      transcript: '',
      isProcessing: false,
      commandResult: null,
      error: null,
      handleTranscription: jest.fn()
    }));
    
    render(<App />);
    
    // Click the microphone button
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }));
    
    // Verify that setIsListening was called to start listening
    expect(mockSetIsListening).toHaveBeenCalledWith(true);
  });

  it('displays task details correctly', async () => {
    render(<App />);
    
    // Check if task details are displayed correctly
    expect(screen.getByText(/Complete project proposal/i)).toBeInTheDocument();
    expect(screen.getByText(/Apr 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Marketing Campaign/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Team meeting/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 29, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/14:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/Internal/i)).toBeInTheDocument();
  });

  it('navigates between different views', async () => {
    render(<App />);
    
    // Check if navigation elements exist
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    
    // Click on Calendar view
    fireEvent.click(screen.getByText(/Calendar/i));
    
    // Verify that Calendar view is displayed
    expect(screen.getByText(/Calendar View/i)).toBeInTheDocument();
    
    // Click on Tasks view
    fireEvent.click(screen.getByText(/Tasks/i));
    
    // Verify that Tasks view is displayed
    expect(screen.getByText(/Task List/i)).toBeInTheDocument();
  });
});
