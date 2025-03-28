import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import TaskList from '../../../src/components/views/TaskList';

// Mock the hooks
jest.mock('../../../src/hooks/useTasks', () => ({
  __esModule: true,
  default: () => ({
    tasks: [
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
      }
    ],
    loading: false,
    error: null,
    completeTask: jest.fn(),
    deleteTask: jest.fn(),
    refreshTasks: jest.fn()
  })
}));

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TaskList />);
    
    // Check if the component renders the task list title
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    
    // Check if the component renders the tasks
    expect(screen.getByText(/Complete project proposal/i)).toBeInTheDocument();
    expect(screen.getByText(/Team meeting/i)).toBeInTheDocument();
    
    // Check if the component renders the task details
    expect(screen.getByText(/Apr 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 29, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/14:00/i)).toBeInTheDocument();
    
    // Check if the component renders the priority indicators
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
  });

  it('completes a task when checkbox is clicked', async () => {
    const useTasks = require('../../../src/hooks/useTasks').default;
    const mockCompleteTask = jest.fn();
    
    // Mock the hook to return controlled values
    useTasks.mockImplementation(() => ({
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          dueDate: '2025-04-01',
          priority: 'high',
          status: 'in_progress',
          project: 'Marketing Campaign'
        }
      ],
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
    
    render(<TaskList />);
    
    // Click the complete checkbox
    fireEvent.click(screen.getByRole('checkbox', { name: /mark as complete/i }));
    
    // Verify that completeTask was called with the correct task ID
    expect(mockCompleteTask).toHaveBeenCalledWith('1');
  });

  it('deletes a task when delete button is clicked', async () => {
    const useTasks = require('../../../src/hooks/useTasks').default;
    const mockDeleteTask = jest.fn();
    
    // Mock the hook to return controlled values
    useTasks.mockImplementation(() => ({
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          dueDate: '2025-04-01',
          priority: 'high',
          status: 'in_progress',
          project: 'Marketing Campaign'
        }
      ],
      loading: false,
      error: null,
      completeTask: jest.fn(),
      deleteTask: mockDeleteTask,
      refreshTasks: jest.fn()
    }));
    
    render(<TaskList />);
    
    // Click the delete button
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    // Verify that deleteTask was called with the correct task ID
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('displays loading state', async () => {
    const useTasks = require('../../../src/hooks/useTasks').default;
    
    // Mock the hook to return loading state
    useTasks.mockImplementation(() => ({
      tasks: [],
      loading: true,
      error: null,
      completeTask: jest.fn(),
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
    
    render(<TaskList />);
    
    // Check if the loading indicator is displayed
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const useTasks = require('../../../src/hooks/useTasks').default;
    
    // Mock the hook to return error state
    useTasks.mockImplementation(() => ({
      tasks: [],
      loading: false,
      error: 'Failed to load tasks',
      completeTask: jest.fn(),
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
    
    render(<TaskList />);
    
    // Check if the error message is displayed
    expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
  });

  it('displays empty state when no tasks', async () => {
    const useTasks = require('../../../src/hooks/useTasks').default;
    
    // Mock the hook to return empty tasks
    useTasks.mockImplementation(() => ({
      tasks: [],
      loading: false,
      error: null,
      completeTask: jest.fn(),
      deleteTask: jest.fn(),
      refreshTasks: jest.fn()
    }));
    
    render(<TaskList />);
    
    // Check if the empty state message is displayed
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });
});
