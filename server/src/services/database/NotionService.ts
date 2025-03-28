import { Client } from '@notionhq/client';
import { logger } from '../../utils/logger';

/**
 * Service for interacting with Notion API
 */
class NotionService {
  private notion: Client;
  private tasksDatabase: string;
  private projectsDatabase: string;
  private userActivityDatabase: string;
  private dailySummariesDatabase: string;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY || '',
    });
    
    this.tasksDatabase = process.env.NOTION_TASKS_DATABASE_ID || '';
    this.projectsDatabase = process.env.NOTION_PROJECTS_DATABASE_ID || '';
    this.userActivityDatabase = process.env.NOTION_USER_ACTIVITY_DATABASE_ID || '';
    this.dailySummariesDatabase = process.env.NOTION_DAILY_SUMMARIES_DATABASE_ID || '';
  }

  /**
   * Get all tasks
   * @returns Array of tasks
   */
  async getTasks(): Promise<any[]> {
    try {
      logger.info('Fetching tasks from Notion');
      
      const response = await this.notion.databases.query({
        database_id: this.tasksDatabase,
        sorts: [
          {
            property: 'Due Date',
            direction: 'ascending',
          },
        ],
      });
      
      return response.results;
    } catch (error) {
      logger.error('Error fetching tasks from Notion:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * Get task by ID
   * @param id - Task ID
   * @returns Task data
   */
  async getTaskById(id: string): Promise<any> {
    try {
      logger.info(`Fetching task ${id} from Notion`);
      
      const response = await this.notion.pages.retrieve({
        page_id: id,
      });
      
      return response;
    } catch (error) {
      logger.error(`Error fetching task ${id} from Notion:`, error);
      throw new Error('Failed to fetch task');
    }
  }

  /**
   * Create a new task
   * @param taskData - Task data
   * @returns Created task
   */
  async createTask(taskData: any): Promise<any> {
    try {
      logger.info('Creating task in Notion');
      
      // Format data for Notion
      const properties: any = {
        Title: {
          title: [
            {
              text: {
                content: taskData.title,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: taskData.description || '',
              },
            },
          ],
        },
        Status: {
          select: {
            name: taskData.status || 'Not Started',
          },
        },
      };
      
      if (taskData.dueDate) {
        properties['Due Date'] = {
          date: {
            start: taskData.dueDate,
          },
        };
      }
      
      if (taskData.time) {
        properties['Time'] = {
          rich_text: [
            {
              text: {
                content: taskData.time,
              },
            },
          ],
        };
      }
      
      if (taskData.priority) {
        properties['Priority'] = {
          select: {
            name: taskData.priority,
          },
        };
      }
      
      if (taskData.project) {
        properties['Project'] = {
          select: {
            name: taskData.project,
          },
        };
      }
      
      const response = await this.notion.pages.create({
        parent: {
          database_id: this.tasksDatabase,
        },
        properties,
      });
      
      return response;
    } catch (error) {
      logger.error('Error creating task in Notion:', error);
      throw new Error('Failed to create task');
    }
  }

  /**
   * Update a task
   * @param id - Task ID
   * @param taskData - Updated task data
   * @returns Updated task
   */
  async updateTask(id: string, taskData: any): Promise<any> {
    try {
      logger.info(`Updating task ${id} in Notion`);
      
      // Format data for Notion
      const properties: any = {};
      
      if (taskData.title) {
        properties['Title'] = {
          title: [
            {
              text: {
                content: taskData.title,
              },
            },
          ],
        };
      }
      
      if (taskData.description !== undefined) {
        properties['Description'] = {
          rich_text: [
            {
              text: {
                content: taskData.description || '',
              },
            },
          ],
        };
      }
      
      if (taskData.status) {
        properties['Status'] = {
          select: {
            name: taskData.status,
          },
        };
      }
      
      if (taskData.dueDate) {
        properties['Due Date'] = {
          date: {
            start: taskData.dueDate,
          },
        };
      }
      
      if (taskData.time) {
        properties['Time'] = {
          rich_text: [
            {
              text: {
                content: taskData.time,
              },
            },
          ],
        };
      }
      
      if (taskData.priority) {
        properties['Priority'] = {
          select: {
            name: taskData.priority,
          },
        };
      }
      
      if (taskData.project) {
        properties['Project'] = {
          select: {
            name: taskData.project,
          },
        };
      }
      
      // If task is being completed, add completed timestamp
      if (taskData.status === 'Completed') {
        properties['Completed At'] = {
          date: {
            start: new Date().toISOString(),
          },
        };
      }
      
      const response = await this.notion.pages.update({
        page_id: id,
        properties,
      });
      
      return response;
    } catch (error) {
      logger.error(`Error updating task ${id} in Notion:`, error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Delete a task (archive in Notion)
   * @param id - Task ID
   * @returns Success status
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      logger.info(`Archiving task ${id} in Notion`);
      
      await this.notion.pages.update({
        page_id: id,
        archived: true,
      });
      
      return true;
    } catch (error) {
      logger.error(`Error archiving task ${id} in Notion:`, error);
      throw new Error('Failed to delete task');
    }
  }

  /**
   * Get tasks for a specific date
   * @param date - Date string (YYYY-MM-DD)
   * @returns Array of tasks
   */
  async getTasksForDate(date: string): Promise<any[]> {
    try {
      logger.info(`Fetching tasks for date ${date} from Notion`);
      
      const response = await this.notion.databases.query({
        database_id: this.tasksDatabase,
        filter: {
          property: 'Due Date',
          date: {
            equals: date,
          },
        },
      });
      
      return response.results;
    } catch (error) {
      logger.error(`Error fetching tasks for date ${date} from Notion:`, error);
      throw new Error('Failed to fetch tasks for date');
    }
  }

  /**
   * Create user activity log
   * @param activityData - Activity data
   * @returns Created activity
   */
  async createUserActivity(activityData: any): Promise<any> {
    try {
      logger.info('Creating user activity in Notion');
      
      // Format data for Notion
      const properties: any = {
        Action: {
          title: [
            {
              text: {
                content: activityData.action,
              },
            },
          ],
        },
        Command: {
          rich_text: [
            {
              text: {
                content: activityData.command || '',
              },
            },
          ],
        },
        Success: {
          checkbox: activityData.success,
        },
        Details: {
          rich_text: [
            {
              text: {
                content: activityData.details || '',
              },
            },
          ],
        },
      };
      
      if (activityData.relatedTask) {
        properties['Related Task'] = {
          relation: [
            {
              id: activityData.relatedTask,
            },
          ],
        };
      }
      
      const response = await this.notion.pages.create({
        parent: {
          database_id: this.userActivityDatabase,
        },
        properties,
      });
      
      return response;
    } catch (error) {
      logger.error('Error creating user activity in Notion:', error);
      throw new Error('Failed to create user activity');
    }
  }

  /**
   * Get all projects
   * @returns Array of projects
   */
  async getProjects(): Promise<any[]> {
    try {
      logger.info('Fetching projects from Notion');
      
      const response = await this.notion.databases.query({
        database_id: this.projectsDatabase,
      });
      
      return response.results;
    } catch (error) {
      logger.error('Error fetching projects from Notion:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  /**
   * Create a daily summary
   * @param summaryData - Summary data
   * @returns Created summary
   */
  async createDailySummary(summaryData: any): Promise<any> {
    try {
      logger.info('Creating daily summary in Notion');
      
      // Format data for Notion
      const properties: any = {
        Date: {
          title: [
            {
              text: {
                content: summaryData.date,
              },
            },
          ],
        },
        'Summary Text': {
          rich_text: [
            {
              text: {
                content: summaryData.summaryText || '',
              },
            },
          ],
        },
        'Task Count': {
          number: summaryData.taskCount || 0,
        },
        'High Priority Count': {
          number: summaryData.highPriorityCount || 0,
        },
        'Completed Count': {
          number: summaryData.completedCount || 0,
        },
        Delivered: {
          checkbox: summaryData.delivered || false,
        },
      };
      
      const response = await this.notion.pages.create({
        parent: {
          database_id: this.dailySummariesDatabase,
        },
        properties,
      });
      
      return response;
    } catch (error) {
      logger.error('Error creating daily summary in Notion:', error);
      throw new Error('Failed to create daily summary');
    }
  }
}

export default new NotionService();
