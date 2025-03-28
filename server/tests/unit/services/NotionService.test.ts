import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import NotionService from '../../../src/services/database/NotionService';

// Mock the Notion client
jest.mock('@notionhq/client');
const { Client } = require('@notionhq/client');

describe('NotionService', () => {
  let mockClient;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.NOTION_API_KEY = 'mock-api-key';
    process.env.NOTION_TASKS_DATABASE_ID = 'mock-tasks-db-id';
    process.env.NOTION_PROJECTS_DATABASE_ID = 'mock-projects-db-id';
    process.env.NOTION_USER_ACTIVITY_DATABASE_ID = 'mock-activity-db-id';
    process.env.NOTION_DAILY_SUMMARIES_DATABASE_ID = 'mock-summaries-db-id';
    
    // Setup mock client
    mockClient = {
      databases: {
        query: jest.fn(),
      },
      pages: {
        create: jest.fn(),
        update: jest.fn(),
        retrieve: jest.fn(),
      },
    };
    
    // Mock the Client constructor to return our mock client
    Client.mockImplementation(() => mockClient);
  });

  it('should get all tasks successfully', async () => {
    // Mock successful response
    const mockResponse = {
      results: [
        {
          id: 'page-id-1',
          properties: {
            Title: {
              title: [{ text: { content: 'Complete project proposal' } }]
            },
            'Due Date': {
              date: { start: '2025-04-01' }
            },
            Priority: {
              select: { name: 'High' }
            },
            Status: {
              select: { name: 'In Progress' }
            }
          }
        },
        {
          id: 'page-id-2',
          properties: {
            Title: {
              title: [{ text: { content: 'Team meeting' } }]
            },
            'Due Date': {
              date: { start: '2025-03-29' }
            },
            Time: {
              rich_text: [{ text: { content: '14:00' } }]
            },
            Priority: {
              select: { name: 'Medium' }
            },
            Status: {
              select: { name: 'Not Started' }
            }
          }
        }
      ]
    };
    mockClient.databases.query.mockResolvedValue(mockResponse);

    // Call the service
    const result = await NotionService.getTasks();

    // Verify the result
    expect(result).toEqual(mockResponse.results);
    
    // Verify client was called correctly
    expect(mockClient.databases.query).toHaveBeenCalledTimes(1);
    expect(mockClient.databases.query).toHaveBeenCalledWith({
      database_id: 'mock-tasks-db-id',
      sorts: [
        {
          property: 'Due Date',
          direction: 'ascending',
        },
      ],
    });
  });

  it('should create a task successfully', async () => {
    // Mock successful response
    const mockResponse = {
      id: 'page-id-3',
      properties: {
        Title: {
          title: [{ text: { content: 'New task' } }]
        },
        'Due Date': {
          date: { start: '2025-04-05' }
        },
        Priority: {
          select: { name: 'Medium' }
        },
        Status: {
          select: { name: 'Not Started' }
        }
      }
    };
    mockClient.pages.create.mockResolvedValue(mockResponse);

    // Task data
    const taskData = {
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'Medium'
    };

    // Call the service
    const result = await NotionService.createTask(taskData);

    // Verify the result
    expect(result).toEqual(mockResponse);
    
    // Verify client was called correctly
    expect(mockClient.pages.create).toHaveBeenCalledTimes(1);
    expect(mockClient.pages.create).toHaveBeenCalledWith({
      parent: {
        database_id: 'mock-tasks-db-id',
      },
      properties: expect.objectContaining({
        Title: expect.objectContaining({
          title: [expect.objectContaining({
            text: { content: 'New task' }
          })]
        }),
        Status: expect.objectContaining({
          select: { name: 'Not Started' }
        })
      })
    });
  });

  it('should update a task successfully', async () => {
    // Mock successful response
    const mockResponse = {
      id: 'page-id-1',
      properties: {
        Title: {
          title: [{ text: { content: 'Updated task' } }]
        },
        'Due Date': {
          date: { start: '2025-04-10' }
        },
        Priority: {
          select: { name: 'High' }
        },
        Status: {
          select: { name: 'In Progress' }
        }
      }
    };
    mockClient.pages.update.mockResolvedValue(mockResponse);

    // Task data
    const taskId = 'page-id-1';
    const taskData = {
      title: 'Updated task',
      dueDate: '2025-04-10',
      priority: 'High',
      status: 'In Progress'
    };

    // Call the service
    const result = await NotionService.updateTask(taskId, taskData);

    // Verify the result
    expect(result).toEqual(mockResponse);
    
    // Verify client was called correctly
    expect(mockClient.pages.update).toHaveBeenCalledTimes(1);
    expect(mockClient.pages.update).toHaveBeenCalledWith({
      page_id: 'page-id-1',
      properties: expect.objectContaining({
        Title: expect.objectContaining({
          title: [expect.objectContaining({
            text: { content: 'Updated task' }
          })]
        }),
        Status: expect.objectContaining({
          select: { name: 'In Progress' }
        })
      })
    });
  });

  it('should delete a task successfully', async () => {
    // Mock successful response
    mockClient.pages.update.mockResolvedValue({ id: 'page-id-1', archived: true });

    // Call the service
    const result = await NotionService.deleteTask('page-id-1');

    // Verify the result
    expect(result).toBe(true);
    
    // Verify client was called correctly
    expect(mockClient.pages.update).toHaveBeenCalledTimes(1);
    expect(mockClient.pages.update).toHaveBeenCalledWith({
      page_id: 'page-id-1',
      archived: true,
    });
  });

  it('should handle API errors', async () => {
    // Mock error response
    mockClient.databases.query.mockRejectedValue(new Error('API Error'));

    // Call the service and expect it to throw
    await expect(NotionService.getTasks())
      .rejects
      .toThrow('Failed to fetch tasks');
  });

  it('should get tasks for a specific date', async () => {
    // Mock successful response
    const mockResponse = {
      results: [
        {
          id: 'page-id-2',
          properties: {
            Title: {
              title: [{ text: { content: 'Team meeting' } }]
            },
            'Due Date': {
              date: { start: '2025-03-29' }
            },
            Time: {
              rich_text: [{ text: { content: '14:00' } }]
            },
            Priority: {
              select: { name: 'Medium' }
            },
            Status: {
              select: { name: 'Not Started' }
            }
          }
        }
      ]
    };
    mockClient.databases.query.mockResolvedValue(mockResponse);

    // Call the service
    const result = await NotionService.getTasksForDate('2025-03-29');

    // Verify the result
    expect(result).toEqual(mockResponse.results);
    
    // Verify client was called correctly
    expect(mockClient.databases.query).toHaveBeenCalledTimes(1);
    expect(mockClient.databases.query).toHaveBeenCalledWith({
      database_id: 'mock-tasks-db-id',
      filter: {
        property: 'Due Date',
        date: {
          equals: '2025-03-29',
        },
      },
    });
  });
});
