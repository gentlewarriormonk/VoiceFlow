import { useState, useEffect, useRef } from 'react';
import ApiService from '../../services/ApiService';

/**
 * Hook for managing chatbot conversations with AI
 */
const useChatbot = () => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedActions, setSuggestedActions] = useState<Array<{
    type: string;
    parameters?: Record<string, any>;
    displayText: string;
  }>>([
    {
      type: "show_tasks",
      parameters: { timeframe: "today" },
      displayText: "Show today's tasks"
    },
    {
      type: "help",
      displayText: "What can you do?"
    }
  ]);
  
  // Store conversation history for context
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?' }
  ]);
  
  // Send message to chatbot
  const sendMessage = async (text: string) => {
    try {
      // Add user message to UI
      const userMessage = {
        id: Date.now().toString(),
        text,
        sender: 'user' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Add to conversation history
      conversationHistoryRef.current.push({ role: 'user', content: text });
      
      // Process with AI
      setIsProcessing(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock chatbot response
      let response;
      
      if (text.toLowerCase().includes('meeting')) {
        response = {
          text: "Would you like me to schedule a meeting? I can add it to your task list.",
          suggestedActions: [
            {
              type: "create_task",
              parameters: {
                task: "meeting",
                date: "tomorrow",
                time: "14:00"
              },
              displayText: "Schedule for tomorrow at 2pm"
            },
            {
              type: "modify",
              displayText: "Choose a different time"
            }
          ]
        };
      } else if (text.toLowerCase().includes('today') || text.toLowerCase().includes('schedule')) {
        response = {
          text: "You have 3 tasks scheduled for today. Your next task is a team meeting at 2pm.",
          suggestedActions: [
            {
              type: "show_tasks",
              parameters: { timeframe: "today" },
              displayText: "Show all tasks"
            },
            {
              type: "read_schedule",
              displayText: "Read my schedule"
            }
          ]
        };
      } else if (text.toLowerCase().includes('help')) {
        response = {
          text: "I can help you manage your tasks. You can ask me to create, update, or complete tasks, or to show you your schedule.",
          suggestedActions: [
            {
              type: "show_tasks",
              parameters: { timeframe: "today" },
              displayText: "Show today's tasks"
            },
            {
              type: "create_task",
              displayText: "Create a new task"
            }
          ]
        };
      } else {
        response = {
          text: "I understand. Is there anything specific you'd like me to help you with regarding your tasks?",
          suggestedActions: [
            {
              type: "show_tasks",
              parameters: { timeframe: "today" },
              displayText: "Show today's tasks"
            },
            {
              type: "help",
              displayText: "What can you do?"
            }
          ]
        };
      }
      
      // In production, this would be:
      // const response = await ApiService.getChatbotResponse(text, conversationHistoryRef.current);
      
      // Add bot response to UI
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Add to conversation history
      conversationHistoryRef.current.push({ role: 'assistant', content: response.text });
      
      // Update suggested actions
      if (response.suggestedActions) {
        setSuggestedActions(response.suggestedActions);
      }
      
      return response;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setError('Failed to get response from assistant');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Execute suggested action
  const executeAction = async (action: {
    type: string;
    parameters?: Record<string, any>;
    displayText: string;
  }) => {
    // Add user message based on action
    await sendMessage(action.displayText);
    
    // In a real implementation, this would execute the action
    // based on the type and parameters
    console.log('Executing action:', action);
    
    // For now, we'll just return the action
    return action;
  };
  
  return {
    messages,
    isProcessing,
    error,
    suggestedActions,
    sendMessage,
    executeAction
  };
};

export default useChatbot;
