import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ApiService from '../../services/ApiService';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const VoiceRecorder = ({ onTranscription, isListening, setIsListening }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isListening && !isRecording) {
      startRecording();
    } else if (!isListening && isRecording) {
      stopRecording();
    }
  }, [isListening]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingStatus('Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setRecordingStatus('Processing audio...');
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        try {
          // In a real implementation, this would call the API service
          // For now, we'll simulate a response
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock transcription result
          const mockTranscription = "Add a meeting with the design team tomorrow at 3pm";
          
          // In production, this would be:
          // const result = await ApiService.transcribeAudio(audioBlob);
          // onTranscription(result.text);
          
          onTranscription(mockTranscription);
          setRecordingStatus('');
          setIsRecording(false);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          setRecordingStatus('Error processing audio');
          setTimeout(() => setRecordingStatus(''), 3000);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus('Listening...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('Error accessing microphone');
      setTimeout(() => setRecordingStatus(''), 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const toggleRecording = () => {
    setIsListening(!isListening);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton 
        color={isRecording ? "secondary" : "primary"} 
        onClick={toggleRecording}
        sx={{ 
          position: 'relative',
          animation: isRecording ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)' }
          }
        }}
      >
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
      
      {recordingStatus && (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          {recordingStatus === 'Listening...' && (
            <CircularProgress size={16} sx={{ mr: 1 }} color="secondary" />
          )}
          {recordingStatus === 'Processing audio...' && (
            <CircularProgress size={16} sx={{ mr: 1 }} />
          )}
          <Typography variant="body2">{recordingStatus}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VoiceRecorder;
