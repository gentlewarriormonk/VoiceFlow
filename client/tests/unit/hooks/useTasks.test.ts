import { renderHook, act } from '@testing-library/react-hooks';
import useTasks from '../../../src/hooks/useTasks';

// Mock ApiService
jest.mock('../../../src/services/ApiService', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));
const ApiService = require('../../../src/services/ApiService');

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true); // Initially loading
    expect(result.current.error).toBe(null);
  });

  it('fetches tasks on mount', async () => {
    // Mock successful API response
    const mockTasks = [
      {
        id: '1',
        title: 'Complete project proposal',
        dueDate: '2025-04-01',
        priority: 'high',
        status: 'in_progress'
      },
      {
        id: '2',
        title: 'Team meeting',
        dueDate: '2025-03-29',
        time: '14:00',
        priority: 'medium',
        status: 'not_started'
      }
    ];
    
    ApiService.getTasks.mockResolvedValue(mockTasks);
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for fetch to complete
    await waitForNextUpdate();
    
    // Verify the result
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch errors', async () => {
    // Mock API error
    ApiService.getTasks.mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for fetch to complete
    await waitForNextUpdate();
    
    // Verify error handling
    expect(result.current.error).toBe('Failed to load tasks');
    expect(result.current.loading).toBe(false);
  });

  it('creates a task successfully', async () => {
    // Mock successful API responses
    const mockTasks = [];
    ApiService.getTasks.mockResolvedValue(mockTasks);
    
    const newTask = {
      id: '1',
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium',
      status: 'not_started'
    };
    ApiService.createTask.mockResolvedValue(newTask);
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for initial fetch to complete
    await waitForNextUpdate();
    
    // Create task
    let createdTask;
    await act(async () => {
      createdTask = await result.current.createTask({
        title: 'New task',
        dueDate: '2025-04-05',
        priority: 'medium'
      });
    });
    
    // Verify the result
    expect(createdTask).toEqual(newTask);
    expect(result.current.tasks).toEqual([newTask]);
    expect(ApiService.createTask).toHaveBeenCalledWith({
      title: 'New task',
      dueDate: '2025-04-05',
      priority: 'medium'
    });
  });

  it('updates a task successfully', async () => {
    // Mock successful API responses
    const mockTasks = [
      {
        id: '1',
        title: 'Original task',
        dueDate: '2025-04-01',
        priority: 'medium',
        status: 'not_started'
      }
    ];
    ApiService.getTasks.mockResolvedValue(mockTasks);
    
    const updatedTask = {
      id: '1',
      title: 'Updated task',
      dueDate: '2025-04-05',
      priority: 'high',
      status: 'in_progress'
    };
    ApiService.updateTask.mockResolvedValue(updatedTask);
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for initial fetch to complete
    await waitForNextUpdate();
    
    // Update task
    let resultTask;
    await act(async () => {
      resultTask = await result.current.updateTask('1', {
        title: 'Updated task',
        dueDate: '2025-04-05',
        priority: 'high',
        status: 'in_progress'
      });
    });
    
    // Verify the result
    expect(resultTask).toEqual(updatedTask);
    expect(result.current.tasks[0]).toEqual(updatedTask);
    expect(ApiService.updateTask).toHaveBeenCalledWith('1', {
      title: 'Updated task',
      dueDate: '2025-04-05',
      priority: 'high',
      status: 'in_progress'
    });
  });

  it('deletes a task successfully', async () => {
    // Mock successful API responses
    const mockTasks = [
      {
        id: '1',
        title: 'Task to delete',
        dueDate: '2025-04-01',
        priority: 'medium',
        status: 'not_started'
      }
    ];
    ApiService.getTasks.mockResolvedValue(mockTasks);
    ApiService.deleteTask.mockResolvedValue({ success: true });
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for initial fetch to complete
    await waitForNextUpdate();
    
    // Delete task
    await act(async () => {
      await result.current.deleteTask('1');
    });
    
    // Verify the result
    expect(result.current.tasks).toEqual([]);
    expect(ApiService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('completes a task successfully', async () => {
    // Mock successful API responses
    const mockTasks = [
      {
        id: '1',
        title: 'Task to complete',
        dueDate: '2025-04-01',
        priority: 'medium',
        status: 'not_started'
      }
    ];
    ApiService.getTasks.mockResolvedValue(mockTasks);
    
    const completedTask = {
      id: '1',
      title: 'Task to complete',
      dueDate: '2025-04-01',
      priority: 'medium',
      status: 'completed'
    };
    ApiService.updateTask.mockResolvedValue(completedTask);
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for initial fetch to complete
    await waitForNextUpdate();
    
    // Complete task
    await act(async () => {
      await result.current.completeTask('1');
    });
    
    // Verify the result
    expect(result.current.tasks[0].status).toBe('completed');
    expect(ApiService.updateTask).toHaveBeenCalledWith('1', {
      ...mockTasks[0],
      status: 'completed'
    });
  });

  it('refreshes tasks', async () => {
    // Mock successful API responses
    const initialTasks = [{ id: '1', title: 'Initial task' }];
    const refreshedTasks = [
      { id: '1', title: 'Initial task' },
      { id: '2', title: 'New task' }
    ];
    
    ApiService.getTasks
      .mockResolvedValueOnce(initialTasks)
      .mockResolvedValueOnce(refreshedTasks);
    
    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    
    // Wait for initial fetch to complete
    await waitForNextUpdate();
    
    // Verify initial tasks
    expect(result.current.tasks).toEqual(initialTasks);
    
    // Refresh tasks
    act(() => {
      result.current.refreshTasks();
    });
    
    // Wait for refresh to complete
    await waitForNextUpdate();
    
    // Verify refreshed tasks
    expect(result.current.tasks).toEqual(refreshedTasks);
    expect(ApiService.getTasks).toHaveBeenCalledTimes(2);
  });
});
