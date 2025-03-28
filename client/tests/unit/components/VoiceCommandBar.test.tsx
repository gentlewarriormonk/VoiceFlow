import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import VoiceCommandBar from '../../../src/components/common/VoiceCommandBar';

// Mock the hooks
jest.mock('../../../src/hooks/useVoiceCommands', () => ({
  __esModule: true,
  default: () => ({
    isListening: false,
    setIsListening: jest.fn(),
    transcript: '',
    isProcessing: false,
    commandResult: null,
    error: null,
    handleTranscription: jest.fn()
  })
}));

jest.mock('../../../src/hooks/useAIAssistant', () => ({
  __esModule: true,
  default: () => ({
    startListening: jest.fn(),
    stopListening: jest.fn(),
    isListening: false,
    isProcessing: false,
    transcript: '',
    feedbackMessage: null
  })
}));

describe('VoiceCommandBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<VoiceCommandBar />);
    
    // Check if the component renders the microphone button
    expect(screen.getByRole('button', { name: /microphone/i })).toBeInTheDocument();
    
    // Check if the component renders the status text
    expect(screen.getByText(/click to speak/i)).toBeInTheDocument();
  });

  it('changes state when microphone button is clicked', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    const mockStartListening = jest.fn();
    const mockStopListening = jest.fn();
    
    // Mock the hook to return controlled values
    useAIAssistant.mockImplementation(() => ({
      startListening: mockStartListening,
      stopListening: mockStopListening,
      isListening: false,
      isProcessing: false,
      transcript: '',
      feedbackMessage: null
    }));
    
    render(<VoiceCommandBar />);
    
    // Click the microphone button
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }));
    
    // Verify that startListening was called
    expect(mockStartListening).toHaveBeenCalledTimes(1);
  });

  it('displays transcript when listening', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    
    // Mock the hook to return listening state with transcript
    useAIAssistant.mockImplementation(() => ({
      startListening: jest.fn(),
      stopListening: jest.fn(),
      isListening: true,
      isProcessing: false,
      transcript: 'Create a new task',
      feedbackMessage: null
    }));
    
    render(<VoiceCommandBar />);
    
    // Check if the transcript is displayed
    expect(screen.getByText('Create a new task')).toBeInTheDocument();
    
    // Check if the listening status is displayed
    expect(screen.getByText(/listening.../i)).toBeInTheDocument();
  });

  it('displays processing state', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    
    // Mock the hook to return processing state
    useAIAssistant.mockImplementation(() => ({
      startListening: jest.fn(),
      stopListening: jest.fn(),
      isListening: false,
      isProcessing: true,
      transcript: 'Create a new task',
      feedbackMessage: null
    }));
    
    render(<VoiceCommandBar />);
    
    // Check if the processing status is displayed
    expect(screen.getByText(/processing.../i)).toBeInTheDocument();
  });

  it('displays feedback message when available', async () => {
    const useAIAssistant = require('../../../src/hooks/useAIAssistant').default;
    
    // Mock the hook to return a feedback message
    useAIAssistant.mockImplementation(() => ({
      startListening: jest.fn(),
      stopListening: jest.fn(),
      isListening: false,
      isProcessing: false,
      transcript: '',
      feedbackMessage: "I've created a new task for tomorrow"
    }));
    
    render(<VoiceCommandBar />);
    
    // Check if the feedback message is displayed
    expect(screen.getByText("I've created a new task for tomorrow")).toBeInTheDocument();
  });
});
