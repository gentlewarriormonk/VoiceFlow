import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, IconButton, Fab, Drawer } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import VoiceCommandBar from '../common/VoiceCommandBar';
import ChatbotInterface from '../common/ChatbotInterface';

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  // Mock tasks for initial UI
  useEffect(() => {
    setTasks([
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
    ]);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData
    };
    
    setTasks([...tasks, newTask]);
  };
  
  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (currentTab) {
      case 0: // Today
        return tasks.filter(task => task.dueDate === today);
      case 1: // This Week
        // In a real implementation, this would filter for the current week
        return tasks;
      case 2: // By Priority
        return [...tasks].sort((a, b) => {
          const priorityValues = { high: 3, medium: 2, low: 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        });
      case 3: // Timeline
        return [...tasks].sort((a, b) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      default:
        return tasks;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <Box sx={{ flexGrow: 0 }}>
        <Paper elevation={3} square>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Task Manager
            </Typography>
            <IconButton color="inherit" onClick={toggleChat}>
              <ChatIcon />
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6">Menu</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}>
              <DashboardIcon sx={{ mr: 2 }} />
              <Typography>Dashboard</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}>
              <AssignmentIcon sx={{ mr: 2 }} />
              <Typography>Tasks</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}>
              <DateRangeIcon sx={{ mr: 2 }} />
              <Typography>Calendar</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <FormatListBulletedIcon sx={{ mr: 2 }} />
              <Typography>Projects</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab label="Today" />
            <Tab label="This Week" />
            <Tab label="By Priority" />
            <Tab label="Timeline" />
          </Tabs>
        </Paper>
        
        <TaskList tasks={getFilteredTasks()} />
      </Box>
      
      {/* Voice Command Bar */}
      <VoiceCommandBar isRecording={isRecording} />
      
      {/* Chatbot Interface */}
      <ChatbotInterface isOpen={isChatOpen} onClose={toggleChat} />
      
      {/* Task Form Dialog */}
      <TaskForm 
        open={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
        onSubmit={handleCreateTask} 
      />
      
      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Fab 
          color="secondary" 
          aria-label="add task"
          onClick={() => setIsTaskFormOpen(true)}
        >
          <AddIcon />
        </Fab>
        <Fab 
          color="primary" 
          aria-label="voice command"
          onClick={toggleRecording}
        >
          <MicIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default Dashboard;
