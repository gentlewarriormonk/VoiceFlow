import axios from 'axios';
import { logger } from '../../utils/logger';

/**
 * Service for interacting with Airtable API
 */
class AirtableService {
  private apiKey: string;
  private baseId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
  }

  /**
   * Get all tasks
   * @returns Array of tasks
   */
  async getTasks(): Promise<any[]> {
    try {
      logger.info('Fetching tasks from Airtable');
      
      const response = await axios.get(
        `${this.baseUrl}/Tasks`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          params: {
            view: 'Grid view'
          }
        }
      );
      
      return response.data.records;
    } catch (error) {
      logger.error('Error fetching tasks from Airtable:', error);
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
      logger.info(`Fetching task ${id} from Airtable`);
      
      const response = await axios.get(
        `${this.baseUrl}/Tasks/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Error fetching task ${id} from Airtable:`, error);
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
      logger.info('Creating task in Airtable');
      
      // Format data for Airtable
      const fields = {
        Title: taskData.title,
        Description: taskData.description,
        'Due Date': taskData.dueDate,
        Time: taskData.time,
        Priority: taskData.priority,
        Status: taskData.status || 'Not Started',
        Project: taskData.project,
        'Created At': new Date().toISOString()
      };
      
      const response = await axios.post(
        `${this.baseUrl}/Tasks`,
        { fields },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error('Error creating task in Airtable:', error);
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
      logger.info(`Updating task ${id} in Airtable`);
      
      // Format data for Airtable
      const fields: Record<string, any> = {};
      
      if (taskData.title) fields.Title = taskData.title;
      if (taskData.description) fields.Description = taskData.description;
      if (taskData.dueDate) fields['Due Date'] = taskData.dueDate;
      if (taskData.time) fields.Time = taskData.time;
      if (taskData.priority) fields.Priority = taskData.priority;
      if (taskData.status) fields.Status = taskData.status;
      if (taskData.project) fields.Project = taskData.project;
      
      fields['Updated At'] = new Date().toISOString();
      
      // If task is being completed, add completed timestamp
      if (taskData.status === 'Completed') {
        fields['Completed At'] = new Date().toISOString();
      }
      
      const response = await axios.patch(
        `${this.baseUrl}/Tasks/${id}`,
        { fields },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Error updating task ${id} in Airtable:`, error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Success status
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting task ${id} from Airtable`);
      
      await axios.delete(
        `${this.baseUrl}/Tasks/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return true;
    } catch (error) {
      logger.error(`Error deleting task ${id} from Airtable:`, error);
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
      logger.info(`Fetching tasks for date ${date} from Airtable`);
      
      const response = await axios.get(
        `${this.baseUrl}/Tasks`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          params: {
            filterByFormula: `{Due Date} = '${date}'`
          }
        }
      );
      
      return response.data.records;
    } catch (error) {
      logger.error(`Error fetching tasks for date ${date} from Airtable:`, error);
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
      logger.info('Creating user activity in Airtable');
      
      // Format data for Airtable
      const fields = {
        Action: activityData.action,
        Command: activityData.command,
        Timestamp: activityData.timestamp,
        'Related Task': activityData.relatedTask ? [activityData.relatedTask] : undefined,
        Success: activityData.success,
        Details: activityData.details
      };
      
      const response = await axios.post(
        `${this.baseUrl}/User Activity`,
        { fields },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error('Error creating user activity in Airtable:', error);
      throw new Error('Failed to create user activity');
    }
  }

  /**
   * Get all projects
   * @returns Array of projects
   */
  async getProjects(): Promise<any[]> {
    try {
      logger.info('Fetching projects from Airtable');
      
      const response = await axios.get(
        `${this.baseUrl}/Projects`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          params: {
            view: 'Grid view'
          }
        }
      );
      
      return response.data.records;
    } catch (error) {
      logger.error('Error fetching projects from Airtable:', error);
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
      logger.info('Creating daily summary in Airtable');
      
      // Format data for Airtable
      const fields = {
        Date: summaryData.date,
        'Summary Text': summaryData.summaryText,
        'Task Count': summaryData.taskCount,
        'High Priority Count': summaryData.highPriorityCount,
        'Completed Count': summaryData.completedCount,
        'Generated At': summaryData.generatedAt || new Date().toISOString(),
        Delivered: summaryData.delivered || false
      };
      
      const response = await axios.post(
        `${this.baseUrl}/Daily Summaries`,
        { fields },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error('Error creating daily summary in Airtable:', error);
      throw new Error('Failed to create daily summary');
    }
  }
}

export default new AirtableService();
