import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import AirtableService from '../../../src/services/database/AirtableService';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('AirtableService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.AIRTABLE_API_KEY = 'mock-api-key';
    process.env.AIRTABLE_BASE_ID = 'mock-base-id';
  });

  it('should get all tasks successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        records: [
          {
            id: 'rec123',
            fields: {
              Title: 'Complete project proposal',
              'Due Date': '2025-04-01',
              Priority: 'high',
              Status: 'in_progress'
            }
          },
          {
            id: 'rec456',
            fields: {
              Title: 'Team meeting',
              'Due Date': '2025-03-29',
              Time: '14:00',
              Priority: 'medium',
              Status: 'not_started'
            }
          }
        ]
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the service
    const result = await AirtableService.getTasks();

    // Verify the result
    expect(result).toEqual(mockResponse.data.records);
    
    // Verify axios was called correctly
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/mock-base-id/Tasks',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-api-key',
          'Content-Type': 'application/json'
        }),
        params: expect.objectContaining({
          view: 'Grid view'
        })
      })
    );
  });

  it('should create a task successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        id: 'rec789',
        fields: {
          Title: 'New task',
          'Due Date': '2025-04-05',
          Priority: 'medium',
          Status: 'not_started'
        }
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    // Task data
    const taskData = {
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium'
    };

    // Call the service
    const result = await AirtableService.createTask(taskData);

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/mock-base-id/Tasks',
      expect.objectContaining({
        fields: expect.objectContaining({
          Title: 'New task',
          'Due Date': '2025-04-05',
          Priority: 'medium',
          Status: 'Not Started'
        })
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-api-key',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should update a task successfully', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        id: 'rec123',
        fields: {
          Title: 'Updated task',
          'Due Date': '2025-04-10',
          Priority: 'high',
          Status: 'in_progress'
        }
      }
    };
    axios.patch.mockResolvedValue(mockResponse);

    // Task data
    const taskId = 'rec123';
    const taskData = {
      title: 'Updated task',
      dueDate: '2025-04-10',
      priority: 'high',
      status: 'in_progress'
    };

    // Call the service
    const result = await AirtableService.updateTask(taskId, taskData);

    // Verify the result
    expect(result).toEqual(mockResponse.data);
    
    // Verify axios was called correctly
    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/mock-base-id/Tasks/rec123',
      expect.objectContaining({
        fields: expect.objectContaining({
          Title: 'Updated task',
          'Due Date': '2025-04-10',
          Priority: 'high',
          Status: 'in_progress'
        })
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-api-key',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should delete a task successfully', async () => {
    // Mock successful response
    axios.delete.mockResolvedValue({ data: { deleted: true } });

    // Call the service
    const result = await AirtableService.deleteTask('rec123');

    // Verify the result
    expect(result).toBe(true);
    
    // Verify axios was called correctly
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/mock-base-id/Tasks/rec123',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-api-key',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should handle API errors', async () => {
    // Mock error response
    axios.get.mockRejectedValue(new Error('API Error'));

    // Call the service and expect it to throw
    await expect(AirtableService.getTasks())
      .rejects
      .toThrow('Failed to fetch tasks');
  });

  it('should get tasks for a specific date', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        records: [
          {
            id: 'rec123',
            fields: {
              Title: 'Team meeting',
              'Due Date': '2025-03-29',
              Time: '14:00',
              Priority: 'medium',
              Status: 'not_started'
            }
          }
        ]
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the service
    const result = await AirtableService.getTasksForDate('2025-03-29');

    // Verify the result
    expect(result).toEqual(mockResponse.data.records);
    
    // Verify axios was called correctly
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/mock-base-id/Tasks',
      expect.objectContaining({
        params: expect.objectContaining({
          filterByFormula: `{Due Date} = '2025-03-29'`
        })
      })
    );
  });
});
