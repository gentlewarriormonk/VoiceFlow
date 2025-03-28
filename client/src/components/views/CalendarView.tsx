import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import ApiService from '../../services/ApiService';

interface CalendarViewProps {
  onTaskSelect?: (taskId: string) => void;
}

const CalendarView = ({ onTaskSelect }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [currentDate, currentView]);

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
        },
        {
          id: '5',
          title: 'Client call',
          dueDate: '2025-04-03',
          time: '10:00',
          priority: 'high',
          status: 'not_started',
          project: 'Sales'
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: 'month' | 'week') => {
    setCurrentView(newValue);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate days for the month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Create array for all days to display
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Generate days for the week view
  const generateWeekDays = () => {
    const date = new Date(currentDate);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Set to the first day of the week (Sunday)
    date.setDate(date.getDate() - day);
    
    const days = [];
    
    // Add all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      days.push(newDate);
    }
    
    return days;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format day for display
  const formatDay = (date: Date) => {
    return date.getDate();
  };

  // Format weekday for display
  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    if (!date) return false;
    
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Calendar
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handlePrevious}>
            <ChevronLeftIcon />
          </IconButton>
          
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleToday}
            startIcon={<TodayIcon />}
            sx={{ mx: 1 }}
          >
            Today
          </Button>
          
          <IconButton onClick={handleNext}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          {formatDate(currentDate)}
        </Typography>
        
        <Tabs value={currentView} onChange={handleViewChange}>
          <Tab label="Month" value="month" />
          <Tab label="Week" value="week" />
        </Tabs>
      </Box>
      
      {currentView === 'month' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {/* Weekday headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box 
              key={day} 
              sx={{ 
                p: 1, 
                textAlign: 'center',
                fontWeight: 'bold',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              {day}
            </Box>
          ))}
          
          {/* Calendar days */}
          {generateMonthDays().map((date, index) => (
            <Box 
              key={index} 
              sx={{ 
                p: 1, 
                height: 100,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: isToday(date) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                overflow: 'hidden'
              }}
            >
              {date && (
                <>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      textAlign: 'right',
                      fontWeight: isToday(date) ? 'bold' : 'normal',
                      color: isToday(date) ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {formatDay(date)}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    {getTasksForDate(date).map(task => (
                      <Box 
                        key={task.id}
                        sx={{ 
                          p: 0.5,
                          mb: 0.5,
                          borderRadius: 0.5,
                          bgcolor: task.priority === 'high' ? 'error.light' : 
                                  task.priority === 'medium' ? 'warning.light' : 'success.light',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer'
                        }}
                        onClick={() => onTaskSelect && onTaskSelect(task.id)}
                      >
                        {task.time && `${task.time} `}{task.title}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
      )}
      
      {currentView === 'week' && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Weekday headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {generateWeekDays().map((date, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isToday(date) ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold'
                  }}
                >
                  {formatWeekday(date)}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: isToday(date) ? 'bold' : 'normal',
                    color: isToday(date) ? 'primary.main' : 'text.primary'
                  }}
                >
                  {formatDay(date)}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* Week view content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mt: 1 }}>
            {generateWeekDays().map((date, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 1,
                  minHeight: 200,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isToday(date) ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                }}
              >
                <Box sx={{ mt: 1 }}>
                  {getTasksForDate(date).map(task => (
                    <Box 
                      key={task.id}
                      sx={{ 
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: task.priority === 'high' ? 'error.light' : 
                                task.priority === 'medium' ? 'warning.light' : 'success.light',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => onTaskSelect && onTaskSelect(task.id)}
                    >
                      {task.time && (
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                          {task.time}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        {task.title}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading calendar...</Typography>
        </Box>
      )}
      
      {error && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={fetchTasks} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CalendarView;
