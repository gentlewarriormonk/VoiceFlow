import { renderHook, act } from '@testing-library/react-hooks';
import useChatbot from '../../../src/hooks/useChatbot';

// Mock ApiService
jest.mock('../../../src/services/ApiService', () => ({
  getChatbotResponse: jest.fn()
}));
const ApiService = require('../../../src/services/ApiService');

describe('useChatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useChatbot());
    
    // Check initial messages
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].sender).toBe('bot');
    expect(result.current.messages[0].text).toContain('Hello');
    
    // Check other initial values
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.suggestedActions.length).toBe(2);
  });

  it('sends message and receives response', async () => {
    // Mock successful API response
    const mockResponse = {
      text: "I'll help you manage your tasks. What would you like to do today?",
      suggestedActions: [
        {
          type: "show_tasks",
          parameters: { timeframe: "today" },
          displayText: "Show today's tasks"
        }
      ]
    };
    
    ApiService.getChatbotResponse.mockResolvedValue(mockResponse);
    
    const { result, waitForNextUpdate } = renderHook(() => useChatbot());
    
    // Send message
    act(() => {
      result.current.sendMessage('Help me with my tasks');
    });
    
    // Verify processing state
    expect(result.current.isProcessing).toBe(true);
    
    // Wait for processing to complete
    await waitForNextUpdate();
    
    // Verify the result
    expect(result.current.messages.length).toBe(3); // Initial + user + bot
    expect(result.current.messages[1].sender).toBe('user');
    expect(result.current.messages[1].text).toBe('Help me with my tasks');
    expect(result.current.messages[2].sender).toBe('bot');
    expect(result.current.messages[2].text).toBe("I'll help you manage your tasks. What would you like to do today?");
    
    // Verify suggested actions
    expect(result.current.suggestedActions).toEqual(mockResponse.suggestedActions);
    
    // Verify processing state
    expect(result.current.isProcessing).toBe(false);
  });

  it('handles API errors', async () => {
    // Mock API error
    ApiService.getChatbotResponse.mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useChatbot());
    
    // Send message
    act(() => {
      result.current.sendMessage('Help me with my tasks');
    });
    
    // Wait for processing to complete
    await waitForNextUpdate();
    
    // Verify error handling
    expect(result.current.error).toBe('Failed to get response from assistant');
    expect(result.current.isProcessing).toBe(false);
  });

  it('executes suggested action', async () => {
    // Mock successful API response
    const mockResponse = {
      text: "Here are your tasks for today.",
      suggestedActions: []
    };
    
    ApiService.getChatbotResponse.mockResolvedValue(mockResponse);
    
    const { result, waitForNextUpdate } = renderHook(() => useChatbot());
    
    // Execute action
    const action = {
      type: "show_tasks",
      parameters: { timeframe: "today" },
      displayText: "Show today's tasks"
    };
    
    act(() => {
      result.current.executeAction(action);
    });
    
    // Wait for processing to complete
    await waitForNextUpdate();
    
    // Verify the result
    expect(result.current.messages.length).toBe(3); // Initial + user + bot
    expect(result.current.messages[1].sender).toBe('user');
    expect(result.current.messages[1].text).toBe("Show today's tasks");
    expect(result.current.messages[2].sender).toBe('bot');
    expect(result.current.messages[2].text).toBe("Here are your tasks for today.");
  });
});
