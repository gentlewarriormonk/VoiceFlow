import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import aiRoutes from '../../../src/api/ai';
import GeminiService from '../../../src/services/ai/GeminiService';

// Mock the services
jest.mock('../../../src/services/ai/GeminiService');

describe('AI API Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/ai', aiRoutes);
  });

  it('should process command successfully', async () => {
    // Mock the service response
    const mockResult = {
      intent: 'create_task',
      entities: {
        task: 'review project proposal',
        date: 'friday',
        priority: 'high'
      },
      confidence: 0.92
    };
    GeminiService.processCommand.mockResolvedValue(mockResult);
    
    // Make request
    const response = await request(app)
      .post('/api/ai/process-command')
      .send({ command: 'Create a task to review project proposal by Friday with high priority' })
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      result: mockResult
    });
    
    // Verify service was called
    expect(GeminiService.processCommand).toHaveBeenCalledWith(
      'Create a task to review project proposal by Friday with high priority'
    );
  });

  it('should handle processing errors', async () => {
    // Mock service error
    GeminiService.processCommand.mockRejectedValue(new Error('Failed to process command'));
    
    // Make request
    const response = await request(app)
      .post('/api/ai/process-command')
      .send({ command: 'Test command' })
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to process command'
    });
  });

  it('should generate chatbot response successfully', async () => {
    // Mock the service response
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
    GeminiService.generateChatbotResponse.mockResolvedValue(mockResponse);
    
    // Mock conversation history
    const conversationHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there! How can I help you?' }
    ];
    
    // Make request
    const response = await request(app)
      .post('/api/ai/chat')
      .send({ 
        message: 'Help me with my tasks',
        conversationHistory: conversationHistory
      })
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      response: mockResponse
    });
    
    // Verify service was called
    expect(GeminiService.generateChatbotResponse).toHaveBeenCalledWith(
      'Help me with my tasks',
      conversationHistory
    );
  });

  it('should handle chatbot response errors', async () => {
    // Mock service error
    GeminiService.generateChatbotResponse.mockRejectedValue(new Error('Failed to generate response'));
    
    // Make request
    const response = await request(app)
      .post('/api/ai/chat')
      .send({ 
        message: 'Test message',
        conversationHistory: []
      })
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to generate response'
    });
  });
});
