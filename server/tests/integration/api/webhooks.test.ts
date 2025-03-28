import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import webhooksRoutes from '../../../src/api/webhooks';
import N8nIntegrationService from '../../../src/services/automation/N8nIntegrationService';
import AirtableService from '../../../src/services/database/AirtableService';

// Mock the services
jest.mock('../../../src/services/automation/N8nIntegrationService');
jest.mock('../../../src/services/database/AirtableService');

describe('Webhooks API Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/webhooks', webhooksRoutes);
  });

  it('should handle voice command webhook successfully', async () => {
    // Mock the service responses
    const mockTask = {
      id: '1',
      fields: {
        Title: 'New task',
        'Due Date': '2025-04-05',
        Priority: 'medium',
        Status: 'not_started'
      }
    };
    AirtableService.createTask.mockResolvedValue(mockTask);
    
    // Webhook data
    const webhookData = {
      intent: 'create_task',
      entities: {
        task: 'New task',
        date: '2025-04-05',
        priority: 'medium'
      },
      transcript: 'Create a new task for April 5th with medium priority'
    };
    
    // Make request
    const response = await request(app)
      .post('/api/webhooks/voice-command')
      .send(webhookData)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      result: {
        task: mockTask,
        message: expect.any(String)
      }
    });
    
    // Verify service was called
    expect(AirtableService.createTask).toHaveBeenCalledWith({
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium'
    });
  });

  it('should handle daily summary webhook successfully', async () => {
    // Mock the service responses
    const mockTasks = [
      {
        id: '1',
        fields: {
          Title: 'Complete project proposal',
          'Due Date': '2025-04-01',
          Priority: 'high',
          Status: 'in_progress'
        }
      },
      {
        id: '2',
        fields: {
          Title: 'Team meeting',
          'Due Date': '2025-03-29',
          Time: '14:00',
          Priority: 'medium',
          Status: 'not_started'
        }
      }
    ];
    AirtableService.getTasksForDate.mockResolvedValue(mockTasks);
    
    // Webhook data
    const webhookData = {
      date: '2025-03-29',
      userId: 'user123'
    };
    
    // Make request
    const response = await request(app)
      .post('/api/webhooks/daily-summary')
      .send(webhookData)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      summary: {
        date: '2025-03-29',
        tasks: mockTasks,
        taskCount: 2,
        highPriorityCount: expect.any(Number),
        message: expect.any(String)
      }
    });
    
    // Verify service was called
    expect(AirtableService.getTasksForDate).toHaveBeenCalledWith('2025-03-29');
  });

  it('should handle task reminder webhook successfully', async () => {
    // Mock the service responses
    const mockTask = {
      id: '1',
      fields: {
        Title: 'Complete project proposal',
        'Due Date': '2025-04-01',
        Priority: 'high',
        Status: 'in_progress'
      }
    };
    AirtableService.getTaskById.mockResolvedValue(mockTask);
    
    // Webhook data
    const webhookData = {
      taskId: '1',
      userId: 'user123'
    };
    
    // Make request
    const response = await request(app)
      .post('/api/webhooks/task-reminder')
      .send(webhookData)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      reminder: {
        task: mockTask,
        message: expect.any(String)
      }
    });
    
    // Verify service was called
    expect(AirtableService.getTaskById).toHaveBeenCalledWith('1');
  });

  it('should handle webhook errors', async () => {
    // Mock service error
    AirtableService.getTasksForDate.mockRejectedValue(new Error('Failed to fetch tasks'));
    
    // Webhook data
    const webhookData = {
      date: '2025-03-29',
      userId: 'user123'
    };
    
    // Make request
    const response = await request(app)
      .post('/api/webhooks/daily-summary')
      .send(webhookData)
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to generate daily summary'
    });
  });
});
