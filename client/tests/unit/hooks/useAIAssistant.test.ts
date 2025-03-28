import { renderHook, act } from '@testing-library/react-hooks';
import useAIAssistant from '../../../src/hooks/useAIAssistant';

// Mock the individual hooks
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
    suggestedActions: [],
    sendMessage: jest.fn().mockResolvedValue({
      text: "I'll help you manage your tasks.",
      suggestedActions: []
    }),
    executeAction: jest.fn()
  })
}));

jest.mock('../../../src/hooks/useTasks', () => ({
  __esModule: true,
  default: () => ({
    tasks: [],
    loading: false,
    error: null,
    createTask: jest.fn().mockResolvedValue({ id: '1', title: 'New task' }),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    completeTask: jest.fn(),
    refreshTasks: jest.fn()
  })
}));

jest.mock('../../../src/hooks/useTextToSpeech', () => ({
  __esModule: true,
  default: () => ({
    speak: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    isSpeaking: false,
    currentAudioUrl: null,
    error: null
  })
}));

describe('useAIAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAIAssistant());
    
    expect(result.current.isListening).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(result.current.commandResult).toBe(null);
    expect(result.current.feedbackMessage).toBe(null);
    expect(result.current.chatMessages.length).toBe(1);
    expect(result.current.isChatProcessing).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.tasks).toEqual([]);
    expect(result.current.isTasksLoading).toBe(false);
  });

  it('starts and stops listening', () => {
    const { result } = renderHook(() => useAIAssistant());
    const useVoiceCommands = require('../../../src/hooks/useVoiceCommands').default;
    
    // Start listening
    act(() => {
      result.current.startListening();
    });
    
    // Verify setIsListening was called
    expect(useVoiceCommands().setIsListening).toHaveBeenCalledWith(true);
    
    // Stop listening
    act(() => {
      result.current.stopListening();
    });
    
    // Verify setIsListening was called
    expect(useVoiceCommands().setIsListening).toHaveBeenCalledWith(false);
  });

  it('sends chat message', async () => {
    const { result } = renderHook(() => useAIAssistant());
    const useChatbot = require('../../../src/hooks/useChatbot').default;
    
    // Send message
    await act(async () => {
      await result.current.sendChatMessage('Help me with my tasks');
    });
    
    // Verify sendMessage was called
    expect(useChatbot().sendMessage).toHaveBeenCalledWith('Help me with my tasks');
  });

  it('executes chat action', async () => {
    const { result } = renderHook(() => useAIAssistant());
    const useChatbot = require('../../../src/hooks/useChatbot').default;
    
    // Execute action
    const action = {
      type: "show_tasks",
      parameters: { timeframe: "today" },
      displayText: "Show today's tasks"
    };
    
    await act(async () => {
      await result.current.executeChatAction(action);
    });
    
    // Verify executeAction was called
    expect(useChatbot().executeAction).toHaveBeenCalledWith(action);
  });

  it('creates task', async () => {
    const { result } = renderHook(() => useAIAssistant());
    const useTasks = require('../../../src/hooks/useTasks').default;
    const useTextToSpeech = require('../../../src/hooks/useTextToSpeech').default;
    
    // Create task
    const taskData = {
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium'
    };
    
    await act(async () => {
      await result.current.createTask(taskData);
    });
    
    // Verify createTask was called
    expect(useTasks().createTask).toHaveBeenCalledWith(taskData);
    
    // Verify speak was called with feedback
    expect(useTextToSpeech().speak).toHaveBeenCalled();
  });

  it('handles command result', async () => {
    // Mock the hooks with specific implementations for this test
    const mockHandleCreateTask = jest.fn().mockResolvedValue({ id: '1', title: 'New task' });
    
    jest.mock('../../../src/hooks/useAIAssistant', () => {
      const originalModule = jest.requireActual('../../../src/hooks/useAIAssistant');
      return {
        ...originalModule,
        handleCreateTask: mockHandleCreateTask
      };
    });
    
    const { result, rerender } = renderHook(() => useAIAssistant());
    
    // Set command result
    const commandResult = {
      intent: 'create_task',
      entities: {
        task: 'New task',
        date: 'tomorrow'
      },
      confidence: 0.92
    };
    
    // Manually trigger handleCommandResult
    await act(async () => {
      await result.current.handleCommandResult(commandResult);
    });
    
    // Verify speak was called with feedback
    const useTextToSpeech = require('../../../src/hooks/useTextToSpeech').default;
    expect(useTextToSpeech().speak).toHaveBeenCalled();
  });
});
