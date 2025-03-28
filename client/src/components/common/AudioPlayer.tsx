import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import ApiService from '../../services/ApiService';

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
  onPlayComplete?: () => void;
}

const AudioPlayer = ({ text, autoPlay = false, onPlayComplete }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (text && autoPlay) {
      synthesizeSpeech();
    }
  }, [text, autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (onPlayComplete) {
          onPlayComplete();
        }
      };
    }
  }, [audioUrl, onPlayComplete]);

  const synthesizeSpeech = async () => {
    if (!text) return;
    
    try {
      setIsPlaying(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock audio URL
      // In production, this would be:
      // const result = await ApiService.synthesizeSpeech(text);
      // setAudioUrl(result.audioUrl);
      
      // For demo purposes, we'll use a sample audio file
      setAudioUrl("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3");
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      setError('Error generating audio');
      setIsPlaying(false);
    }
  };

  return (
    <Box>
      {audioUrl && (
        <audio 
          ref={audioRef}
          src={audioUrl} 
          style={{ display: 'none' }}
        />
      )}
      
      {isPlaying && (
        <Typography variant="caption" color="primary">
          Speaking...
        </Typography>
      )}
      
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AudioPlayer;
