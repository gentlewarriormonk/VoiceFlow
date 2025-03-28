import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import GeminiService from '../../../src/services/ai/GeminiService';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('GeminiService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should process command successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    intent: 'create_task',
                    entities: {
                      task: 'review project proposal',
                      date: 'friday',
                      priority: 'high'
                    },
                    confidence: 0.92
                  })
                }
              ]
            }
          }
        ]
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    const result = await GeminiService.processCommand('Create a task to review project proposal by Friday with high priority');

    // Verify the result
    expect(result).toEqual({
      intent: 'create_task',
      entities: {
        task: 'review project proposal',
        date: 'friday',
        priority: 'high'
      },
      confidence: 0.92
    });
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/v1beta/models/gemini-pro:generateContent'),
      expect.objectContaining({
        contents: expect.arrayContaining([
          expect.objectContaining({
            parts: expect.arrayContaining([
              expect.objectContaining({
                text: expect.stringContaining('Create a task to review project proposal by Friday')
              })
            ])
          })
        ])
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should handle processing errors', async () => {
    // Mock error response
    axios.post.mockRejectedValue(new Error('API Error'));

    // Call the service and expect it to throw
    await expect(GeminiService.processCommand('Test command'))
      .rejects
      .toThrow('Failed to process command');
  });

  it('should handle empty command input', async () => {
    // Call the service with empty command and expect it to throw
    await expect(GeminiService.processCommand(''))
      .rejects
      .toThrow('Command input is empty');
  });

  it('should handle malformed AI response', async () => {
    // Mock response with invalid JSON
    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'This is not valid JSON'
                }
              ]
            }
          }
        ]
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service and expect it to throw
    await expect(GeminiService.processCommand('Test command'))
      .rejects
      .toThrow('Failed to parse AI response');
  });

  it('should generate chatbot response successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "I'll help you manage your tasks. What would you like to do today?"
                }
              ]
            }
          }
        ]
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Mock conversation history
    const conversationHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there! How can I help you?' }
    ];

    // Call the service
    const result = await GeminiService.generateChatbotResponse('Help me with my tasks', conversationHistory);

    // Verify the result
    expect(result).toEqual({
      text: "I'll help you manage your tasks. What would you like to do today?",
      suggestedActions: expect.any(Array)
    });
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/v1beta/models/gemini-pro:generateContent'),
      expect.objectContaining({
        contents: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            parts: expect.arrayContaining([
              expect.objectContaining({
                text: 'Hello'
              })
            ])
          }),
          expect.objectContaining({
            role: 'model',
            parts: expect.arrayContaining([
              expect.objectContaining({
                text: 'Hi there! How can I help you?'
              })
            ])
          }),
          expect.objectContaining({
            role: 'user',
            parts: expect.arrayContaining([
              expect.objectContaining({
                text: 'Help me with my tasks'
              })
            ])
          })
        ])
      }),
      expect.any(Object)
    );
  });
});
