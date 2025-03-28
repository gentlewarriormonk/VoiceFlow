import { Router } from 'express';
import { processCommand, getChatbotResponse } from '../../controllers/ai';

const router = Router();

/**
 * @route POST /api/ai/process
 * @desc Process natural language commands using Gemini API
 * @access Public
 */
router.post('/process', processCommand);

/**
 * @route POST /api/ai/chat
 * @desc Get chatbot response for organizational assistance
 * @access Public
 */
router.post('/chat', getChatbotResponse);

export const aiRoutes = router;
