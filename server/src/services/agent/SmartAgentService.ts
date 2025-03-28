import { logger } from '../../utils/logger';
import GeminiService from '../ai/GeminiService';
import AirtableService from '../database/AirtableService';
import NotionService from '../database/NotionService';
import TextToSpeechService from '../voice/TextToSpeechService';

/**
 * Smart Agent service for proactive task management
 */
class SmartAgentService {
  private databaseService: any;

  constructor() {
    // Select database service based on environment configuration
    this.databaseService = process.env.DATABASE_TYPE === 'notion' 
      ? NotionService 
      : AirtableService;
  }

  /**
   * Generate daily task summary
   * @returns Summary of tasks for the day
   */
  async generateDailySummary(): Promise<{
    summary: string;
    audioUrl?: string;
    taskCount: number;
    highPriorityCount: number;
  }> {
    try {
      logger.info('Generating daily task summary');
      
      // Get today's tasks
      const today = new Date().toISOString().split('T')[0];
      const tasks = await this.databaseService.getTasks({ dueDate: today });
      
      // Count high priority tasks
      const highPriorityTasks = tasks.filter(task => 
        task.fields?.priority === 'high' || 
        task.properties?.priority?.select?.name === 'high'
      );
      
      // Generate summary text
      const summaryText = this.createSummaryText(tasks, highPriorityTasks);
      
      // Generate audio if voice feedback is enabled
      let audioUrl;
      if (process.env.VOICE_FEEDBACK_ENABLED === 'true') {
        const speechResult = await TextToSpeechService.synthesizeSpeech(summaryText);
        audioUrl = speechResult.audioUrl;
      }
      
      return {
        summary: summaryText,
        audioUrl,
        taskCount: tasks.length,
        highPriorityCount: highPriorityTasks.length
      };
    } catch (error) {
      logger.error('Error generating daily summary:', error);
      throw new Error('Failed to generate daily summary');
    }
  }

  /**
   * Create summary text from tasks
   * @param tasks - List of tasks
   * @param highPriorityTasks - List of high priority tasks
   * @returns Formatted summary text
   */
  private createSummaryText(tasks: any[], highPriorityTasks: any[]): string {
    if (tasks.length === 0) {
      return "You have no tasks scheduled for today. Would you like to plan your day?";
    }
    
    const taskCount = tasks.length;
    const highPriorityCount = highPriorityTasks.length;
    
    let summary = `Good morning! You have ${taskCount} task${taskCount !== 1 ? 's' : ''} scheduled for today`;
    
    if (highPriorityCount > 0) {
      summary += `, including ${highPriorityCount} high priority task${highPriorityCount !== 1 ? 's' : ''}`;
    }
    
    summary += '. ';
    
    // Add details about the first few tasks
    const tasksToDetail = Math.min(tasks.length, 3);
    if (tasksToDetail > 0) {
      summary += 'Here are your upcoming tasks: ';
      
      for (let i = 0; i < tasksToDetail; i++) {
        const task = tasks[i];
        const title = task.fields?.title || task.properties?.title?.title[0]?.text?.content;
        const time = task.fields?.time || task.properties?.time?.rich_text?.[0]?.text?.content;
        
        summary += `${title}${time ? ` at ${time}` : ''}`;
        
        if (i < tasksToDetail - 1) {
          summary += ', ';
        } else {
          summary += '.';
        }
      }
      
      if (tasks.length > tasksToDetail) {
        summary += ` And ${tasks.length - tasksToDetail} more task${tasks.length - tasksToDetail !== 1 ? 's' : ''}.`;
      }
    }
    
    return summary;
  }

  /**
   * Suggest task reprioritization
   * @returns Suggested task changes
   */
  async suggestReprioritization(): Promise<{
    suggestions: Array<{
      taskId: string;
      taskTitle: string;
      currentPriority: string;
      suggestedPriority: string;
      reason: string;
    }>;
  }> {
    try {
      logger.info('Generating task reprioritization suggestions');
      
      // Get all tasks
      const tasks = await this.databaseService.getTasks();
      
      // Mock implementation for initial setup
      // In a real implementation, this would use AI to analyze tasks and suggest changes
      const suggestions = [
        {
          taskId: tasks[0]?.id || 'task1',
          taskTitle: tasks[0]?.fields?.title || tasks[0]?.properties?.title?.title[0]?.text?.content || 'Project proposal',
          currentPriority: 'medium',
          suggestedPriority: 'high',
          reason: 'Deadline is approaching within 24 hours'
        }
      ];
      
      return { suggestions };
    } catch (error) {
      logger.error('Error generating reprioritization suggestions:', error);
      throw new Error('Failed to generate reprioritization suggestions');
    }
  }

  /**
   * Detect scheduling conflicts
   * @returns Detected conflicts
   */
  async detectConflicts(): Promise<{
    conflicts: Array<{
      taskId1: string;
      taskId2: string;
      taskTitle1: string;
      taskTitle2: string;
      conflictType: 'time_overlap' | 'resource_conflict' | 'dependency_issue';
      description: string;
    }>;
  }> {
    try {
      logger.info('Detecting scheduling conflicts');
      
      // Get all tasks
      const tasks = await this.databaseService.getTasks();
      
      // Mock implementation for initial setup
      // In a real implementation, this would analyze tasks for conflicts
      const conflicts = [];
      
      // Find tasks on the same day with overlapping times
      for (let i = 0; i < tasks.length; i++) {
        for (let j = i + 1; j < tasks.length; j++) {
          const task1 = tasks[i];
          const task2 = tasks[j];
          
          const date1 = task1.fields?.dueDate || task1.properties?.dueDate?.date?.start;
          const date2 = task2.fields?.dueDate || task2.properties?.dueDate?.date?.start;
          
          const time1 = task1.fields?.time || task1.properties?.time?.rich_text?.[0]?.text?.content;
          const time2 = task2.fields?.time || task2.properties?.time?.rich_text?.[0]?.text?.content;
          
          if (date1 === date2 && time1 === time2 && time1 && time2) {
            conflicts.push({
              taskId1: task1.id,
              taskId2: task2.id,
              taskTitle1: task1.fields?.title || task1.properties?.title?.title[0]?.text?.content,
              taskTitle2: task2.fields?.title || task2.properties?.title?.title[0]?.text?.content,
              conflictType: 'time_overlap',
              description: `Tasks "${task1.fields?.title || task1.properties?.title?.title[0]?.text?.content}" and "${task2.fields?.title || task2.properties?.title?.title[0]?.text?.content}" are scheduled at the same time (${date1} at ${time1})`
            });
          }
        }
      }
      
      return { conflicts };
    } catch (error) {
      logger.error('Error detecting conflicts:', error);
      throw new Error('Failed to detect conflicts');
    }
  }

  /**
   * Analyze productivity patterns
   * @returns Productivity analysis
   */
  async analyzeProductivity(): Promise<{
    mostProductiveDay: string;
    mostProductiveTime: string;
    taskCompletionRate: number;
    averageTasksPerDay: number;
    insights: string[];
  }> {
    try {
      logger.info('Analyzing productivity patterns');
      
      // Mock implementation for initial setup
      // In a real implementation, this would analyze task history
      return {
        mostProductiveDay: 'Tuesday',
        mostProductiveTime: 'Morning (9am-12pm)',
        taskCompletionRate: 0.78,
        averageTasksPerDay: 4.2,
        insights: [
          'You complete 85% more tasks when they are scheduled in the morning',
          'High priority tasks are completed 2.3x faster than medium priority tasks',
          'Tasks with specific times are 65% more likely to be completed than those without'
        ]
      };
    } catch (error) {
      logger.error('Error analyzing productivity:', error);
      throw new Error('Failed to analyze productivity');
    }
  }
}

export default new SmartAgentService();
