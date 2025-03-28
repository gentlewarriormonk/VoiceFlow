import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import N8nIntegrationService from '../../../src/services/automation/N8nIntegrationService';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('N8nIntegrationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.N8N_API_KEY = 'mock-api-key';
    process.env.N8N_BASE_URL = 'http://localhost:5678';
  });

  it('should trigger workflow successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        executionId: 'exec123',
        status: 'success'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    const result = await N8nIntegrationService.triggerWorkflow('workflow123', { test: 'data' });

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5678/webhook/workflow123',
      { test: 'data' },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': 'mock-api-key'
        })
      })
    );
  });

  it('should trigger daily summary workflow', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        executionId: 'exec123',
        status: 'success'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    const result = await N8nIntegrationService.triggerDailySummary();

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5678/webhook/daily-summary',
      expect.objectContaining({
        date: expect.any(String),
        manual: true
      }),
      expect.any(Object)
    );
  });

  it('should trigger voice command workflow', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        executionId: 'exec123',
        status: 'success'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Command data
    const command = {
      intent: 'create_task',
      entities: {
        task: 'review project',
        date: 'tomorrow'
      },
      transcript: 'Create a task to review the project by tomorrow'
    };

    // Call the service
    const result = await N8nIntegrationService.triggerVoiceCommand(command);

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5678/webhook/voice-command',
      command,
      expect.any(Object)
    );
  });

  it('should handle workflow trigger errors', async () => {
    // Mock error response
    axios.post.mockRejectedValue(new Error('API Error'));

    // Call the service and expect it to throw
    await expect(N8nIntegrationService.triggerWorkflow('workflow123', {}))
      .rejects
      .toThrow('Failed to trigger workflow');
  });

  it('should get workflow status successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        id: 'exec123',
        status: 'completed',
        data: {
          resultData: {
            runData: {}
          }
        }
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the service
    const result = await N8nIntegrationService.getWorkflowStatus('exec123');

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:5678/api/v1/executions/exec123',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-N8N-API-KEY': 'mock-api-key'
        })
      })
    );
  });
});
