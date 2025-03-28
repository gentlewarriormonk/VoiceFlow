import { useState, useEffect, useRef } from 'react';
import ApiService from '../../services/ApiService';

/**
 * Hook for integrating voice commands with AI processing
 */
const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandResult, setCommandResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Process voice command when transcript changes
  useEffect(() => {
    if (transcript && !isProcessing) {
      processCommand(transcript);
    }
  }, [transcript]);
  
  // Process command with AI
  const processCommand = async (text) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      console.log('Processing command:', text);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock command processing result
      let result;
      
      if (text.toLowerCase().includes('meeting')) {
        result = {
          intent: "create_task",
          entities: {
            task: "meeting",
            date: text.includes('tomorrow') ? 'tomorrow' : 'today',
            time: text.includes('3pm') ? '15:00' : text.includes('2pm') ? '14:00' : '09:00',
            priority: "medium",
            project: text.includes('design') ? 'Design' : 'General'
          },
          confidence: 0.92
        };
      } else if (text.toLowerCase().includes('reschedule') || text.toLowerCase().includes('move')) {
        result = {
          intent: "update_task",
          entities: {
            task_reference: text.includes('meeting') ? 'meeting' : 'task',
            date: text.includes('tomorrow') ? 'tomorrow' : text.includes('wednesday') ? 'wednesday' : 'friday',
            time: text.includes('3pm') ? '15:00' : text.includes('2pm') ? '14:00' : '09:00',
          },
          confidence: 0.89
        };
      } else if (text.toLowerCase().includes('complete') || text.toLowerCase().includes('done')) {
        result = {
          intent: "complete_task",
          entities: {
            task_reference: text.includes('meeting') ? 'meeting' : 'task',
          },
          confidence: 0.95
        };
      } else if (text.toLowerCase().includes('show') || text.toLowerCase().includes('list')) {
        result = {
          intent: "query_tasks",
          entities: {
            timeframe: text.includes('today') ? 'today' : 
                      text.includes('tomorrow') ? 'tomorrow' : 
                      text.includes('week') ? 'this_week' : 'all',
            project: text.includes('design') ? 'Design' : null,
          },
          confidence: 0.91
        };
      } else {
        result = {
          intent: "unknown",
          entities: {},
          confidence: 0.5
        };
      }
      
      // In production, this would be:
      // const result = await ApiService.processCommand(text);
      
      setCommandResult(result);
      console.log('Command processed:', result);
      
      // Reset transcript after processing
      setTranscript('');
    } catch (error) {
      console.error('Error processing command:', error);
      setError('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle transcription result
  const handleTranscription = (text) => {
    setTranscript(text);
  };
  
  return {
    isListening,
    setIsListening,
    transcript,
    isProcessing,
    commandResult,
    error,
    handleTranscription
  };
};

export default useVoiceCommands;
