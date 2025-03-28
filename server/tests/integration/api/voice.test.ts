import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import voiceRoutes from '../../../src/api/voice';
import WhisperService from '../../../src/services/voice/WhisperService';
import TextToSpeechService from '../../../src/services/voice/TextToSpeechService';

// Mock the services
jest.mock('../../../src/services/voice/WhisperService');
jest.mock('../../../src/services/voice/TextToSpeechService');

describe('Voice API Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/voice', voiceRoutes);
  });

  it('should transcribe audio successfully', async () => {
    // Mock the service response
    WhisperService.transcribeAudio.mockResolvedValue('Create a new task to review the project proposal by Friday');
    
    // Create mock audio data
    const audioData = Buffer.from('mock audio data').toString('base64');
    
    // Make request
    const response = await request(app)
      .post('/api/voice/transcribe')
      .send({ audio: audioData })
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      transcript: 'Create a new task to review the project proposal by Friday'
    });
    
    // Verify service was called
    expect(WhisperService.transcribeAudio).toHaveBeenCalledTimes(1);
  });

  it('should handle transcription errors', async () => {
    // Mock service error
    WhisperService.transcribeAudio.mockRejectedValue(new Error('Failed to transcribe audio'));
    
    // Create mock audio data
    const audioData = Buffer.from('mock audio data').toString('base64');
    
    // Make request
    const response = await request(app)
      .post('/api/voice/transcribe')
      .send({ audio: audioData })
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to transcribe audio'
    });
  });

  it('should synthesize speech successfully', async () => {
    // Mock the service response
    TextToSpeechService.synthesizeSpeech.mockResolvedValue({
      audioContent: 'base64encodedaudio',
      audioUrl: 'data:audio/mp3;base64,base64encodedaudio'
    });
    
    // Make request
    const response = await request(app)
      .post('/api/voice/synthesize')
      .send({ text: 'Hello, this is a test message' })
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      audioUrl: 'data:audio/mp3;base64,base64encodedaudio'
    });
    
    // Verify service was called
    expect(TextToSpeechService.synthesizeSpeech).toHaveBeenCalledWith(
      'Hello, this is a test message',
      undefined
    );
  });

  it('should handle synthesis errors', async () => {
    // Mock service error
    TextToSpeechService.synthesizeSpeech.mockRejectedValue(new Error('Failed to synthesize speech'));
    
    // Make request
    const response = await request(app)
      .post('/api/voice/synthesize')
      .send({ text: 'Test message' })
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to synthesize speech'
    });
  });
});
