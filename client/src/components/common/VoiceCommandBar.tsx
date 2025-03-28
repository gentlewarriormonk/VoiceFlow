import { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface VoiceCommandBarProps {
  isRecording: boolean;
}

const VoiceCommandBar = ({ isRecording }: VoiceCommandBarProps) => {
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate transcription updates when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      setTranscription('Listening...');
      
      // In a real implementation, this would be replaced with actual
      // streaming transcription from the Whisper API
      interval = setInterval(() => {
        const dots = transcription.split('.').length - 1;
        if (dots < 3) {
          setTranscription('Listening' + '.'.repeat(dots + 1));
        } else {
          setTranscription('Listening.');
        }
      }, 500);
    } else if (transcription.startsWith('Listening')) {
      setTranscription('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, transcription]);

  // Simulate AI processing and response
  useEffect(() => {
    if (!isRecording && transcription && !transcription.startsWith('Listening')) {
      setIsProcessing(true);
      
      // Simulate AI processing delay
      const timeout = setTimeout(() => {
        setIsProcessing(false);
        setResponse('I understood your command. Would you like me to create a task for your team meeting tomorrow?');
        
        // Simulate voice response
        setIsSpeaking(true);
        setTimeout(() => {
          setIsSpeaking(false);
        }, 3000);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [isRecording, transcription]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed', 
        bottom: 80, 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '90%', 
        maxWidth: 600,
        p: 2,
        display: isRecording || transcription || response ? 'block' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {isRecording && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: transcription ? 2 : 0 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body1">{transcription}</Typography>
        </Box>
      )}
      
      {!isRecording && transcription && !transcription.startsWith('Listening') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">You said:</Typography>
          <Typography variant="body1">{transcription}</Typography>
        </Box>
      )}
      
      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body1">Processing your request...</Typography>
        </Box>
      )}
      
      {response && !isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isSpeaking ? (
            <IconButton size="small" sx={{ mr: 1 }}>
              <VolumeUpIcon color="primary" />
            </IconButton>
          ) : (
            <IconButton size="small" sx={{ mr: 1 }}>
              <VolumeUpIcon />
            </IconButton>
          )}
          <Typography variant="body1">{response}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default VoiceCommandBar;
