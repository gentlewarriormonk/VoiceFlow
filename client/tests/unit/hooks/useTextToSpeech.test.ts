import { renderHook, act } from '@testing-library/react-hooks';
import useTextToSpeech from '../../../src/hooks/useTextToSpeech';

// Mock ApiService
jest.mock('../../../src/services/ApiService', () => ({
  synthesizeSpeech: jest.fn()
}));
const ApiService = require('../../../src/services/ApiService');

// Mock Audio
const mockAudio = {
  play: jest.fn().mockResolvedValue(undefined),
  onended: null,
  onerror: null
};
global.Audio = jest.fn().mockImplementation(() => mockAudio);

describe('useTextToSpeech', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTextToSpeech());
    
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.currentAudioUrl).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('speaks text successfully', async () => {
    // Mock successful API response
    const mockAudioUrl = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';
    ApiService.synthesizeSpeech.mockResolvedValue({ audioUrl: mockAudioUrl });
    
    const { result, waitForNextUpdate } = renderHook(() => useTextToSpeech());
    
    // Speak text
    let success;
    await act(async () => {
      success = await result.current.speak('Hello, this is a test message');
    });
    
    // Verify the result
    expect(success).toBe(true);
    expect(result.current.isSpeaking).toBe(true);
    
    // Simulate audio ended
    act(() => {
      mockAudio.onended();
    });
    
    // Verify state after audio ended
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.currentAudioUrl).toBe(null);
  });

  it('handles multiple text in queue', async () => {
    // Mock successful API response
    const mockAudioUrl = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';
    ApiService.synthesizeSpeech.mockResolvedValue({ audioUrl: mockAudioUrl });
    
    const { result } = renderHook(() => useTextToSpeech());
    
    // Speak multiple texts
    await act(async () => {
      await result.current.speak('First message');
      await result.current.speak('Second message');
    });
    
    // Verify first message is being spoken
    expect(result.current.isSpeaking).toBe(true);
    
    // Simulate first audio ended
    act(() => {
      mockAudio.onended();
    });
    
    // Verify second message is being spoken
    expect(result.current.isSpeaking).toBe(true);
    
    // Simulate second audio ended
    act(() => {
      mockAudio.onended();
    });
    
    // Verify all done
    expect(result.current.isSpeaking).toBe(false);
  });

  it('handles audio playback errors', async () => {
    // Mock successful API response
    const mockAudioUrl = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';
    ApiService.synthesizeSpeech.mockResolvedValue({ audioUrl: mockAudioUrl });
    
    const { result } = renderHook(() => useTextToSpeech());
    
    // Speak text
    await act(async () => {
      await result.current.speak('Test message');
    });
    
    // Simulate audio error
    act(() => {
      mockAudio.onerror();
    });
    
    // Verify error handling
    expect(result.current.error).toBe('Failed to play audio');
    expect(result.current.isSpeaking).toBe(false);
  });

  it('stops speaking', async () => {
    // Mock successful API response
    const mockAudioUrl = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';
    ApiService.synthesizeSpeech.mockResolvedValue({ audioUrl: mockAudioUrl });
    
    const { result } = renderHook(() => useTextToSpeech());
    
    // Speak text
    await act(async () => {
      await result.current.speak('Test message');
    });
    
    // Verify speaking state
    expect(result.current.isSpeaking).toBe(true);
    
    // Stop speaking
    act(() => {
      result.current.stop();
    });
    
    // Verify stopped state
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.currentAudioUrl).toBe(null);
  });
});
