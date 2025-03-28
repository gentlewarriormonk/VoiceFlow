import { useEffect, useState } from 'react';
import useVoiceCommands from './useVoiceCommands';
import useChatbot from './useChatbot';
import useTasks from './useTasks';
import useTextToSpeech from './useTextToSpeech';

/**
 * Hook for integrating all AI and voice features
 */
const useAIAssistant = () => {
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [lastProcessedCommand, setLastProcessedCommand] = useState<any>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // Initialize hooks
  const voiceCommands = useVoiceCommands();
  const chatbot = useChatbot();
  const tasks = useTasks();
  const tts = useTextToSpeech();
  
  // Process command results when they change
  useEffect(() => {
    if (voiceCommands.commandResult && voiceCommands.commandResult !== lastProcessedCommand) {
      handleCommandResult(voiceCommands.commandResult);
      setLastProcessedCommand(voiceCommands.commandResult);
    }
  }, [voiceCommands.commandResult]);
  
  // Handle command results
  const handleCommandResult = async (result: any) => {
    try {
      setIsAssistantActive(true);
      
      // Process based on intent
      switch (result.intent) {
        case 'create_task':
          await handleCreateTask(result.entities);
          break;
        case 'update_task':
          await handleUpdateTask(result.entities);
          break;
        case 'complete_task':
          await handleCompleteTask(result.entities);
          break;
        case 'query_tasks':
          await handleQueryTasks(result.entities);
          break;
        default:
          // For unknown intents, pass to chatbot
          await handleUnknownIntent(result);
      }
    } catch (error) {
      console.error('Error handling command result:', error);
      setFeedbackMessage('Sorry, I had trouble processing that command.');
      await tts.speak('Sorry, I had trouble processing that command.');
    } finally {
      setIsAssistantActive(false);
    }
  };
  
  // Handle task creation
  const handleCreateTask = async (entities: any) => {
    try {
      // Extract task data from entities
      const taskData = {
        title: entities.task || 'New Task',
        dueDate: resolveDate(entities.date),
        time: entities.time,
        priority: entities.priority || 'medium',
        project: entities.project,
        status: 'not_started'
      };
      
      // Create task
      const newTask = await tasks.createTask(taskData);
      
      // Provide feedback
      const feedback = `I've created a new task: ${taskData.title}${taskData.dueDate ? ` for ${formatDate(taskData.dueDate)}` : ''}${taskData.time ? ` at ${taskData.time}` : ''}.`;
      setFeedbackMessage(feedback);
      await tts.speak(feedback);
      
      // Update chatbot context
      await chatbot.sendMessage(`I need to create a task: ${taskData.title}`);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };
  
  // Handle task update
  const handleUpdateTask = async (entities: any) => {
    try {
      // Find task by reference (in a real app, this would be more sophisticated)
      const taskToUpdate = tasks.tasks.find(task => 
        task.title.toLowerCase().includes(entities.task_reference.toLowerCase())
      );
      
      if (!taskToUpdate) {
        const feedback = `I couldn't find a task matching "${entities.task_reference}".`;
        setFeedbackMessage(feedback);
        await tts.speak(feedback);
        return null;
      }
      
      // Prepare update data
      const updateData = { ...taskToUpdate };
      
      if (entities.date) {
        updateData.dueDate = resolveDate(entities.date);
      }
      
      if (entities.time) {
        updateData.time = entities.time;
      }
      
      if (entities.priority) {
        updateData.priority = entities.priority;
      }
      
      if (entities.status) {
        updateData.status = entities.status;
      }
      
      // Update task
      const updatedTask = await tasks.updateTask(taskToUpdate.id, updateData);
      
      // Provide feedback
      const feedback = `I've updated the task: ${taskToUpdate.title}${updateData.dueDate ? ` to ${formatDate(updateData.dueDate)}` : ''}${updateData.time ? ` at ${updateData.time}` : ''}.`;
      setFeedbackMessage(feedback);
      await tts.speak(feedback);
      
      // Update chatbot context
      await chatbot.sendMessage(`I updated the task: ${taskToUpdate.title}`);
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  // Handle task completion
  const handleCompleteTask = async (entities: any) => {
    try {
      // Find task by reference
      const taskToComplete = tasks.tasks.find(task => 
        task.title.toLowerCase().includes(entities.task_reference.toLowerCase())
      );
      
      if (!taskToComplete) {
        const feedback = `I couldn't find a task matching "${entities.task_reference}".`;
        setFeedbackMessage(feedback);
        await tts.speak(feedback);
        return null;
      }
      
      // Complete task
      const completedTask = await tasks.completeTask(taskToComplete.id);
      
      // Provide feedback
      const feedback = `I've marked the task "${taskToComplete.title}" as complete.`;
      setFeedbackMessage(feedback);
      await tts.speak(feedback);
      
      // Update chatbot context
      await chatbot.sendMessage(`I completed the task: ${taskToComplete.title}`);
      
      return completedTask;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };
  
  // Handle task queries
  const handleQueryTasks = async (entities: any) => {
    try {
      let filteredTasks = [];
      let timeframeDescription = '';
      
      // Filter by timeframe
      if (entities.timeframe === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredTasks = tasks.getTasksForDate(today);
        timeframeDescription = 'today';
      } else if (entities.timeframe === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        filteredTasks = tasks.getTasksForDate(tomorrowStr);
        timeframeDescription = 'tomorrow';
      } else if (entities.timeframe === 'this_week') {
        filteredTasks = tasks.getTasksForCurrentWeek();
        timeframeDescription = 'this week';
      } else {
        filteredTasks = tasks.tasks;
        timeframeDescription = 'in your list';
      }
      
      // Further filter by project if specified
      if (entities.project) {
        filteredTasks = filteredTasks.filter(task => 
          task.project && task.project.toLowerCase() === entities.project.toLowerCase()
        );
        timeframeDescription += ` in the ${entities.project} project`;
      }
      
      // Provide feedback
      let feedback = '';
      if (filteredTasks.length === 0) {
        feedback = `You don't have any tasks scheduled ${timeframeDescription}.`;
      } else {
        feedback = `You have ${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''} ${timeframeDescription}. `;
        
        // Add details for the first few tasks
        const tasksToDetail = Math.min(filteredTasks.length, 3);
        if (tasksToDetail > 0) {
          feedback += 'These include: ';
          
          for (let i = 0; i < tasksToDetail; i++) {
            const task = filteredTasks[i];
            feedback += `${task.title}${task.time ? ` at ${task.time}` : ''}`;
            
            if (i < tasksToDetail - 1) {
              feedback += ', ';
            } else {
              feedback += '.';
            }
          }
          
          if (filteredTasks.length > tasksToDetail) {
            feedback += ` And ${filteredTasks.length - tasksToDetail} more.`;
          }
        }
      }
      
      setFeedbackMessage(feedback);
      await tts.speak(feedback);
      
      // Update chatbot context
      await chatbot.sendMessage(`Show me my tasks ${timeframeDescription}`);
      
      return filteredTasks;
    } catch (error) {
      console.error('Error querying tasks:', error);
      throw error;
    }
  };
  
  // Handle unknown intents
  const handleUnknownIntent = async (result: any) => {
    try {
      // Pass to chatbot
      const originalText = voiceCommands.transcript;
      const response = await chatbot.sendMessage(originalText || 'Help me with my tasks');
      
      // Speak response
      if (response && response.text) {
        await tts.speak(response.text);
      }
      
      return response;
    } catch (error) {
      console.error('Error handling unknown intent:', error);
      throw error;
    }
  };
  
  // Helper function to resolve relative dates
  const resolveDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    const today = new Date();
    
    if (dateStr.toLowerCase() === 'today') {
      return today.toISOString().split('T')[0];
    } else if (dateStr.toLowerCase() === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    } else if (dateStr.toLowerCase() === 'monday' || 
               dateStr.toLowerCase() === 'tuesday' || 
               dateStr.toLowerCase() === 'wednesday' || 
               dateStr.toLowerCase() === 'thursday' || 
               dateStr.toLowerCase() === 'friday' || 
               dateStr.toLowerCase() === 'saturday' || 
               dateStr.toLowerCase() === 'sunday') {
      // Find the next occurrence of the day
      const dayMap: Record<string, number> = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
      };
      
      const targetDay = dayMap[dateStr.toLowerCase()];
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Next week
      }
      
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      return targetDate.toISOString().split('T')[0];
    }
    
    // If it's already a date string, return as is
    return dateStr;
  };
  
  // Helper function to format dates for display
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  // Start listening for voice commands
  const startListening = () => {
    voiceCommands.setIsListening(true);
  };
  
  // Stop listening for voice commands
  const stopListening = () => {
    voiceCommands.setIsListening(false);
  };
  
  return {
    // Voice command state
    isListening: voiceCommands.isListening,
    isProcessing: voiceCommands.isProcessing || isAssistantActive,
    transcript: voiceCommands.transcript,
    commandResult: voiceCommands.commandResult,
    feedbackMessage,
    
    // Chatbot state
    chatMessages: chatbot.messages,
    isChatProcessing: chatbot.isProcessing,
    suggestedActions: chatbot.suggestedActions,
    
    // Text-to-speech state
    isSpeaking: tts.isSpeaking,
    
    // Tasks state
    tasks: tasks.tasks,
    isTasksLoading: tasks.loading,
    
    // Methods
    startListening,
    stopListening,
    sendChatMessage: chatbot.sendMessage,
    executeChatAction: chatbot.executeAction,
    createTask: tasks.createTask,
    updateTask: tasks.updateTask,
    completeTask: tasks.completeTask,
    deleteTask: tasks.deleteTask,
    refreshTasks: tasks.refreshTasks,
    speak: tts.speak,
    stopSpeaking: tts.stop
  };
};

export default useAIAssistant;
