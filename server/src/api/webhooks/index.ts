import express from 'express';
import { logger } from '../../utils/logger';
import AirtableService from '../../services/database/AirtableService';
import NotionService from '../../services/database/NotionService';

const router = express.Router();

// Get database service based on environment configuration
const getDatabaseService = () => {
  return process.env.DATABASE_TYPE === 'notion' 
    ? NotionService 
    : AirtableService;
};

/**
 * @route GET /api/webhooks/health
 * @desc Check webhook health
 * @access Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Webhook endpoint is healthy' });
});

/**
 * @route POST /api/webhooks/n8n
 * @desc Receive webhook from n8n
 * @access Public
 */
router.post('/n8n', async (req, res) => {
  try {
    logger.info('Received webhook from n8n');
    
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    logger.info(`Processing webhook event: ${event}`);
    
    // Process based on event type
    switch (event) {
      case 'daily_summary':
        await processDailySummary(data);
        break;
      case 'task_reminder':
        await processTaskReminder(data);
        break;
      case 'productivity_insights':
        await processProductivityInsights(data);
        break;
      default:
        logger.warn(`Unknown webhook event type: ${event}`);
        return res.status(400).json({ error: 'Unknown event type' });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

/**
 * Process daily summary event
 */
const processDailySummary = async (data) => {
  try {
    logger.info('Processing daily summary webhook');
    
    // Log the event
    await getDatabaseService().createUserActivity({
      action: 'daily_summary_received',
      command: 'system_generated',
      timestamp: new Date().toISOString(),
      success: true,
      details: JSON.stringify(data)
    });
    
    // Additional processing can be added here
    
    return true;
  } catch (error) {
    logger.error('Error processing daily summary:', error);
    throw error;
  }
};

/**
 * Process task reminder event
 */
const processTaskReminder = async (data) => {
  try {
    logger.info('Processing task reminder webhook');
    
    // Log the event
    await getDatabaseService().createUserActivity({
      action: 'task_reminder_received',
      command: 'system_generated',
      timestamp: new Date().toISOString(),
      success: true,
      details: JSON.stringify(data)
    });
    
    // Additional processing can be added here
    
    return true;
  } catch (error) {
    logger.error('Error processing task reminder:', error);
    throw error;
  }
};

/**
 * Process productivity insights event
 */
const processProductivityInsights = async (data) => {
  try {
    logger.info('Processing productivity insights webhook');
    
    // Log the event
    await getDatabaseService().createUserActivity({
      action: 'productivity_insights_received',
      command: 'system_generated',
      timestamp: new Date().toISOString(),
      success: true,
      details: JSON.stringify(data)
    });
    
    // Additional processing can be added here
    
    return true;
  } catch (error) {
    logger.error('Error processing productivity insights:', error);
    throw error;
  }
};

export default router;
