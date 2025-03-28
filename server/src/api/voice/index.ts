import { Router } from 'express';
import { transcribeAudio, synthesizeSpeech } from '../../controllers/voice';

const router = Router();

/**
 * @route POST /api/voice/transcribe
 * @desc Transcribe audio to text using Whisper API
 * @access Public
 */
router.post('/transcribe', transcribeAudio);

/**
 * @route POST /api/voice/synthesize
 * @desc Convert text to speech for voice responses
 * @access Public
 */
router.post('/synthesize', synthesizeSpeech);

export const voiceRoutes = router;
