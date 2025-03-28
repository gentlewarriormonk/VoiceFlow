import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import ChatbotInterface from '../../../src/components/common/ChatbotInterface';

// Mock the hooks
jest.mock('../../../src/hooks/useChatbot', () => ({
  __esModule: true,
  default: () => ({
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
      },
      {
        type: "help",
        displayText: "What can you do?"
      }
    ],
    sendMessage: jest.fn(),
    executeAction: jest.fn()
  })
}));

jest.mock('../../../src/hooks/useAIAssistant', () => ({
  __esModule: true,
  default: () => ({
    chatMessages: [
      {
        id: '1',
        text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ],
    isChatProcessing: false,
    suggestedActions: [
      {
        type: "show_tasks",
        parameters: { timeframe: "today" },
        displayText: "Show today's tasks"
      },
      {
        type: "help",
        displayText: "What can you do?"
      }
    ],
    sendChatMessage: jest.fn(),
    executeChatAction: jest.fn()
  })
}));

describe('ChatbotInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ChatbotInterface />);
    
    // Check if the component renders the welcome message
    expect(screen.getByText(/Hello! I'm your AI assistant/i)).toBeInTheDocument();
    
    // Check if the component renders the input field
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    
    // Check if the component renders the send button
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    
    // Check if the component renders suggested actions
    expect(screen.getByText(/Show today's tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/What can you do?/i)).toBeInTheDocument();
  });

  it('sends message when form is submitted', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    const mockSendChatMessage = jest.fn();
    
    // Mock the hook to return controlled values
    useAIAssistant.mockImplementation(() => ({
      chatMessages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isChatProcessing: false,
      suggestedActions: [],
      sendChatMessage: mockSendChatMessage,
      executeChatAction: jest.fn()
    }));
    
    render(<ChatbotInterface />);
    
    // Type a message
    fireEvent.change(screen.getByPlaceholderText(/Type a message/i), {
      target: { value: 'Create a new task' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('form'));
    
    // Verify that sendChatMessage was called with the correct message
    expect(mockSendChatMessage).toHaveBeenCalledWith('Create a new task');
  });

  it('executes action when suggested action is clicked', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    const mockExecuteChatAction = jest.fn();
    
    // Mock the hook to return controlled values
    useAIAssistant.mockImplementation(() => ({
      chatMessages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isChatProcessing: false,
      suggestedActions: [
        {
          type: "show_tasks",
          parameters: { timeframe: "today" },
          displayText: "Show today's tasks"
        }
      ],
      sendChatMessage: jest.fn(),
      executeChatAction: mockExecuteChatAction
    }));
    
    render(<ChatbotInterface />);
    
    // Click on a suggested action
    fireEvent.click(screen.getByText(/Show today's tasks/i));
    
    // Verify that executeChatAction was called with the correct action
    expect(mockExecuteChatAction).toHaveBeenCalledWith({
      type: "show_tasks",
      parameters: { timeframe: "today" },
      displayText: "Show today's tasks"
    });
  });

  it('displays loading state when processing', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    
    // Mock the hook to return processing state
    useAIAssistant.mockImplementation(() => ({
      chatMessages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isChatProcessing: true,
      suggestedActions: [],
      sendChatMessage: jest.fn(),
      executeChatAction: jest.fn()
    }));
    
    render(<ChatbotInterface />);
    
    // Check if the loading indicator is displayed
    expect(screen.getByText(/Thinking.../i)).toBeInTheDocument();
  });

  it('displays multiple messages in the conversation', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    
    // Mock the hook to return multiple messages
    useAIAssistant.mockImplementation(() => ({
      chatMessages: [
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
          sender: 'bot',
          timestamp: new Date()
        },
        {
          id: '2',
          text: 'I need help with my tasks',
          sender: 'user',
          timestamp: new Date()
        },
        {
          id: '3',
          text: 'I can help you manage your tasks. What would you like to do?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      isChatProcessing: false,
      suggestedActions: [],
      sendChatMessage: jest.fn(),
      executeChatAction: jest.fn()
    }));
    
    render(<ChatbotInterface />);
    
    // Check if all messages are displayed
    expect(screen.getByText(/Hello! I'm your AI assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/I need help with my tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/I can help you manage your tasks/i)).toBeInTheDocument();
  });
});
