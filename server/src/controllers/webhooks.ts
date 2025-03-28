import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

/**
 * @desc Handle incoming webhooks from n8n
 * @param req - Express request object with webhook data
 * @param res - Express response object
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    logger.info('Received webhook from n8n');
    
    // Process the webhook data
    // In production, this would perform actions based on the webhook payload
    
    res.status(200).json({ 
      message: 'Webhook received successfully',
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};

/**
 * @desc Trigger n8n workflow
 * @param req - Express request object with workflow trigger data
 * @param res - Express response object
 */
export const triggerWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId, data } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({ error: 'Workflow ID is required' });
    }
    
    logger.info(`Triggering n8n workflow: ${workflowId}`);
    
    // Mock response for initial setup
    // In production, this would call the n8n API to trigger a workflow
    const result = {
      success: true,
      workflowId,
      executionId: `exec-${Math.floor(Math.random() * 10000)}`,
      triggeredAt: new Date().toISOString()
    };
    
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error triggering workflow:', error);
    res.status(500).json({ error: 'Failed to trigger workflow' });
  }
};
