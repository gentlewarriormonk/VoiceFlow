import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import WhisperService from '../../../src/services/voice/WhisperService';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('WhisperService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should transcribe audio successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        text: 'Create a new task to review the project proposal by Friday'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Mock audio data
    const audioData = Buffer.from('mock audio data');

    // Call the service
    const result = await WhisperService.transcribeAudio(audioData);

    // Verify the result
    expect(result).toEqual('Create a new task to review the project proposal by Friday');
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/v1/audio/transcriptions'),
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Bearer ')
        })
      })
    );
  });

  it('should handle transcription errors', async () => {
    // Mock error response
    axios.post.mockRejectedValue(new Error('API Error'));

    // Mock audio data
    const audioData = Buffer.from('mock audio data');

    // Call the service and expect it to throw
    await expect(WhisperService.transcribeAudio(audioData))
      .rejects
      .toThrow('Failed to transcribe audio');
  });

  it('should handle empty audio data', async () => {
    // Call the service with empty data and expect it to throw
    await expect(WhisperService.transcribeAudio(Buffer.from('')))
      .rejects
      .toThrow('Audio data is empty');
  });
});
