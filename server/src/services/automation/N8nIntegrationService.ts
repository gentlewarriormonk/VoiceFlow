import axios from 'axios';
import { logger } from '../../utils/logger';

/**
 * Service for integrating with n8n automation workflows
 */
class N8nIntegrationService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.N8N_API_KEY || '';
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
  }

  /**
   * Trigger a workflow in n8n
   * @param workflowId - ID of the workflow to trigger
   * @param data - Data to pass to the workflow
   * @returns Result of the workflow execution
   */
  async triggerWorkflow(workflowId: string, data: Record<string, any>): Promise<any> {
    try {
      logger.info(`Triggering n8n workflow: ${workflowId}`);
      
      const webhookUrl = `${this.baseUrl}/webhook/${workflowId}`;
      
      const response = await axios.post(
        webhookUrl,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Error triggering n8n workflow ${workflowId}:`, error);
      throw new Error('Failed to trigger workflow');
    }
  }

  /**
   * Trigger the daily summary workflow
   * @returns Result of the workflow execution
   */
  async triggerDailySummary(): Promise<any> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      return await this.triggerWorkflow('daily-summary', {
        date: today,
        manual: true
      });
    } catch (error) {
      logger.error('Error triggering daily summary workflow:', error);
      throw error;
    }
  }

  /**
   * Trigger the voice command workflow
   * @param command - Voice command data
   * @returns Result of the workflow execution
   */
  async triggerVoiceCommand(command: {
    intent: string;
    entities: Record<string, any>;
    transcript: string;
  }): Promise<any> {
    try {
      return await this.triggerWorkflow('voice-command', command);
    } catch (error) {
      logger.error('Error triggering voice command workflow:', error);
      throw error;
    }
  }

  /**
   * Trigger the task reminder workflow
   * @returns Result of the workflow execution
   */
  async triggerTaskReminder(): Promise<any> {
    try {
      return await this.triggerWorkflow('task-reminder', {
        manual: true
      });
    } catch (error) {
      logger.error('Error triggering task reminder workflow:', error);
      throw error;
    }
  }

  /**
   * Trigger the productivity analysis workflow
   * @returns Result of the workflow execution
   */
  async triggerProductivityAnalysis(): Promise<any> {
    try {
      return await this.triggerWorkflow('productivity-analysis', {
        manual: true
      });
    } catch (error) {
      logger.error('Error triggering productivity analysis workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow status
   * @param executionId - ID of the workflow execution
   * @returns Status of the workflow execution
   */
  async getWorkflowStatus(executionId: string): Promise<any> {
    try {
      logger.info(`Getting status for workflow execution: ${executionId}`);
      
      const response = await axios.get(
        `${this.baseUrl}/api/v1/executions/${executionId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Error getting workflow status for execution ${executionId}:`, error);
      throw new Error('Failed to get workflow status');
    }
  }
}

export default new N8nIntegrationService();
