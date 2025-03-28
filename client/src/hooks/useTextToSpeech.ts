import { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

/**
 * Hook for managing text-to-speech functionality
 */
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Process audio queue when it changes
  useEffect(() => {
    if (audioQueue.length > 0 && !isSpeaking) {
      speakNextInQueue();
    }
  }, [audioQueue, isSpeaking]);

  // Speak text
  const speak = async (text: string) => {
    try {
      // Add to queue
      setAudioQueue(prev => [...prev, text]);
      return true;
    } catch (error) {
      console.error('Error adding text to speech queue:', error);
      setError('Failed to process text-to-speech');
      return false;
    }
  };

  // Process next item in queue
  const speakNextInQueue = async () => {
    if (audioQueue.length === 0) return;

    try {
      setIsSpeaking(true);
      setError(null);
      
      const text = audioQueue[0];
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock audio URL
      // In production, this would be:
      // const result = await ApiService.synthesizeSpeech(text);
      // const audioUrl = result.audioUrl;
      
      // For demo purposes, we'll use a sample audio file
      const audioUrl = "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3";
      
      setCurrentAudioUrl(audioUrl);
      
      // Create audio element and play
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        // Remove from queue when done
        setAudioQueue(prev => prev.slice(1));
        setCurrentAudioUrl(null);
        setIsSpeaking(false);
      };
      
      audio.onerror = () => {
        console.error('Error playing audio');
        setError('Failed to play audio');
        setAudioQueue(prev => prev.slice(1));
        setCurrentAudioUrl(null);
        setIsSpeaking(false);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error processing text-to-speech:', error);
      setError('Failed to process text-to-speech');
      setAudioQueue(prev => prev.slice(1));
      setCurrentAudioUrl(null);
      setIsSpeaking(false);
    }
  };

  // Stop speaking
  const stop = () => {
    setAudioQueue([]);
    setCurrentAudioUrl(null);
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
    currentAudioUrl,
    error
  };
};

export default useTextToSpeech;
