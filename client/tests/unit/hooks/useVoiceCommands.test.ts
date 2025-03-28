import { renderHook, act } from '@testing-library/react-hooks';
import useVoiceCommands from '../../../src/hooks/useVoiceCommands';

// Mock ApiService
jest.mock('../../../src/services/ApiService', () => ({
  processCommand: jest.fn()
}));
const ApiService = require('../../../src/services/ApiService');

describe('useVoiceCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useVoiceCommands());
    
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.commandResult).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('processes transcript when it changes', async () => {
    // Mock successful API response
    const mockResult = {
      intent: 'create_task',
      entities: {
        task: 'review project',
        date: 'tomorrow'
      },
      confidence: 0.92
    };
    
    ApiService.processCommand.mockResolvedValue(mockResult);
    
    const { result, waitForNextUpdate } = renderHook(() => useVoiceCommands());
    
    // Set transcript
    act(() => {
      result.current.handleTranscription('Create a task to review the project by tomorrow');
    });
    
    // Wait for processing to complete
    await waitForNextUpdate();
    
    // Verify the result
    expect(result.current.commandResult).toEqual(mockResult);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.transcript).toBe('');
  });

  it('handles API errors', async () => {
    // Mock API error
    ApiService.processCommand.mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useVoiceCommands());
    
    // Set transcript
    act(() => {
      result.current.handleTranscription('Create a task');
    });
    
    // Wait for processing to complete
    await waitForNextUpdate();
    
    // Verify error handling
    expect(result.current.error).toBe('Failed to process voice command');
    expect(result.current.isProcessing).toBe(false);
  });

  it('toggles listening state', () => {
    const { result } = renderHook(() => useVoiceCommands());
    
    // Start listening
    act(() => {
      result.current.setIsListening(true);
    });
    
    expect(result.current.isListening).toBe(true);
    
    // Stop listening
    act(() => {
      result.current.setIsListening(false);
    });
    
    expect(result.current.isListening).toBe(false);
  });
});
