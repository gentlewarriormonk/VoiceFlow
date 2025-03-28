import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import tasksRoutes from '../../../src/api/tasks';
import AirtableService from '../../../src/services/database/AirtableService';
import NotionService from '../../../src/services/database/NotionService';

// Mock the services
jest.mock('../../../src/services/database/AirtableService');
jest.mock('../../../src/services/database/NotionService');

describe('Tasks API Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/tasks', tasksRoutes);
    
    // Mock environment variable for database selection
    process.env.DATABASE_PROVIDER = 'airtable';
  });

  it('should get all tasks successfully', async () => {
    // Mock the service response
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
    AirtableService.getTasks.mockResolvedValue(mockTasks);
    
    // Make request
    const response = await request(app)
      .get('/api/tasks')
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      tasks: mockTasks
    });
    
    // Verify service was called
    expect(AirtableService.getTasks).toHaveBeenCalledTimes(1);
  });

  it('should create a task successfully', async () => {
    // Mock the service response
    const mockTask = {
      id: '3',
      fields: {
        Title: 'New task',
        'Due Date': '2025-04-05',
        Priority: 'medium',
        Status: 'not_started'
      }
    };
    AirtableService.createTask.mockResolvedValue(mockTask);
    
    // Task data
    const taskData = {
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium'
    };
    
    // Make request
    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect('Content-Type', /json/)
      .expect(201);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      task: mockTask
    });
    
    // Verify service was called
    expect(AirtableService.createTask).toHaveBeenCalledWith(taskData);
  });

  it('should update a task successfully', async () => {
    // Mock the service response
    const mockTask = {
      id: '1',
      fields: {
        Title: 'Updated task',
        'Due Date': '2025-04-10',
        Priority: 'high',
        Status: 'in_progress'
      }
    };
    AirtableService.updateTask.mockResolvedValue(mockTask);
    
    // Task data
    const taskId = '1';
    const taskData = {
      title: 'Updated task',
      dueDate: '2025-04-10',
      priority: 'high',
      status: 'in_progress'
    };
    
    // Make request
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send(taskData)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      task: mockTask
    });
    
    // Verify service was called
    expect(AirtableService.updateTask).toHaveBeenCalledWith(taskId, taskData);
  });

  it('should delete a task successfully', async () => {
    // Mock the service response
    AirtableService.deleteTask.mockResolvedValue(true);
    
    // Task ID
    const taskId = '1';
    
    // Make request
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true
    });
    
    // Verify service was called
    expect(AirtableService.deleteTask).toHaveBeenCalledWith(taskId);
  });

  it('should get tasks for a specific date', async () => {
    // Mock the service response
    const mockTasks = [
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
    
    // Date
    const date = '2025-03-29';
    
    // Make request
    const response = await request(app)
      .get(`/api/tasks/date/${date}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      tasks: mockTasks
    });
    
    // Verify service was called
    expect(AirtableService.getTasksForDate).toHaveBeenCalledWith(date);
  });

  it('should use Notion service when configured', async () => {
    // Change database provider
    process.env.DATABASE_PROVIDER = 'notion';
    
    // Mock the service response
    const mockTasks = [
      {
        id: 'page-id-1',
        properties: {
          Title: {
            title: [{ text: { content: 'Complete project proposal' } }]
          }
        }
      }
    ];
    NotionService.getTasks.mockResolvedValue(mockTasks);
    
    // Make request
    const response = await request(app)
      .get('/api/tasks')
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Verify response
    expect(response.body).toEqual({
      success: true,
      tasks: mockTasks
    });
    
    // Verify Notion service was called instead of Airtable
    expect(NotionService.getTasks).toHaveBeenCalledTimes(1);
    expect(AirtableService.getTasks).not.toHaveBeenCalled();
  });

  it('should handle service errors', async () => {
    // Mock service error
    AirtableService.getTasks.mockRejectedValue(new Error('Failed to fetch tasks'));
    
    // Make request
    const response = await request(app)
      .get('/api/tasks')
      .expect('Content-Type', /json/)
      .expect(500);
    
    // Verify error response
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to fetch tasks'
    });
  });
});
