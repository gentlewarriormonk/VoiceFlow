import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

/**
 * @desc Process natural language commands using Gemini API
 * @param req - Express request object with command text
 * @param res - Express response object
 */
export const processCommand = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Command text is required' });
    }
    
    logger.info(`Processing command: ${text}`);
    
    // Mock response for initial setup
    // In production, this would call the Gemini API for intent recognition
    const processedCommand = {
      intent: "create_task",
      entities: {
        task: "team meeting",
        date: "tomorrow",
        time: "2pm",
        priority: "medium"
      },
      confidence: 0.92
    };
    
    res.status(200).json(processedCommand);
  } catch (error) {
    logger.error('Error processing command:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
};

/**
 * @desc Get chatbot response for organizational assistance
 * @param req - Express request object with user message
 * @param res - Express response object
 */
export const getChatbotResponse = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    logger.info(`Getting chatbot response for: ${message}`);
    
    // Mock response for initial setup
    // In production, this would call the Gemini API for conversational responses
    const chatbotResponse = {
      text: "I can help you stay organized. Would you like me to create a task for your team meeting tomorrow at 2pm?",
      suggestedActions: [
        {
          type: "create_task",
          parameters: {
            task: "team meeting",
            date: "tomorrow",
            time: "2pm"
          },
          displayText: "Yes, create this task"
        },
        {
          type: "modify",
          displayText: "Change the time"
        }
      ]
    };
    
    res.status(200).json(chatbotResponse);
  } catch (error) {
    logger.error('Error getting chatbot response:', error);
    res.status(500).json({ error: 'Failed to get chatbot response' });
  }
};
