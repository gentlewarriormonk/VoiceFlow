import { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

/**
 * Hook for managing task operations
 */
const useTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch tasks when component mounts or refresh is triggered
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock tasks data
      const mockTasks = [
        {
          id: '1',
          title: 'Complete project proposal',
          dueDate: '2025-04-01',
          priority: 'high',
          status: 'in_progress',
          project: 'Marketing Campaign'
        },
        {
          id: '2',
          title: 'Team meeting',
          dueDate: '2025-03-29',
          time: '14:00',
          priority: 'medium',
          status: 'not_started',
          project: 'Internal'
        },
        {
          id: '3',
          title: 'Review quarterly results',
          dueDate: '2025-03-30',
          priority: 'medium',
          status: 'not_started',
          project: 'Finance'
        },
        {
          id: '4',
          title: 'Prepare presentation slides',
          dueDate: '2025-04-02',
          priority: 'high',
          status: 'not_started',
          project: 'Marketing Campaign'
        }
      ];
      
      // In production, this would be:
      // const response = await ApiService.getTasks();
      // setTasks(response);
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock new task with ID
      const newTask = {
        id: Date.now().toString(),
        ...taskData
      };
      
      // In production, this would be:
      // const newTask = await ApiService.createTask(taskData);
      
      // Update local state
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (id: string, taskData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be:
      // const updatedTask = await ApiService.updateTask(id, taskData);
      
      // Mock updated task
      const updatedTask = {
        id,
        ...taskData
      };
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      
      return updatedTask;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      setError('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be:
      // await ApiService.deleteTask(id);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.filter(task => task.id !== id)
      );
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      setError('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Complete a task
  const completeTask = async (id: string) => {
    try {
      // Find the task
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }
      
      // Update the task status
      return await updateTask(id, {
        ...task,
        status: 'completed'
      });
    } catch (error) {
      console.error(`Error completing task ${id}:`, error);
      setError('Failed to complete task');
      throw error;
    }
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.dueDate === date);
  };

  // Get tasks for the current week
  const getTasksForCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  };

  // Get tasks by priority
  const getTasksByPriority = (priority: 'high' | 'medium' | 'low') => {
    return tasks.filter(task => task.priority === priority);
  };

  // Refresh tasks
  const refreshTasks = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasksForDate,
    getTasksForCurrentWeek,
    getTasksByPriority,
    refreshTasks
  };
};

export default useTasks;
