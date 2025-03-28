import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import TextToSpeechService from '../../../src/services/voice/TextToSpeechService';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('TextToSpeechService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should synthesize speech successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        audioContent: 'base64encodedaudio'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    const result = await TextToSpeechService.synthesizeSpeech('Hello, this is a test message');

    // Verify the result
    expect(result).toEqual({
      audioContent: 'base64encodedaudio',
      audioUrl: expect.stringContaining('data:audio/mp3;base64,')
    });
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/v1/text:synthesize'),
      expect.objectContaining({
        input: { text: 'Hello, this is a test message' },
        voice: expect.any(Object),
        audioConfig: expect.any(Object)
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Bearer '),
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should handle synthesis errors', async () => {
    // Mock error response
    axios.post.mockRejectedValue(new Error('API Error'));

    // Call the service and expect it to throw
    await expect(TextToSpeechService.synthesizeSpeech('Test message'))
      .rejects
      .toThrow('Failed to synthesize speech');
  });

  it('should handle empty text input', async () => {
    // Call the service with empty text and expect it to throw
    await expect(TextToSpeechService.synthesizeSpeech(''))
      .rejects
      .toThrow('Text input is empty');
  });

  it('should use correct voice settings', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        audioContent: 'base64encodedaudio'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    await TextToSpeechService.synthesizeSpeech('Test with specific voice', 'en-US-Neural2-F');

    // Verify voice settings in the request
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        voice: expect.objectContaining({
          name: 'en-US-Neural2-F'
        })
      }),
      expect.any(Object)
    );
  });
});
