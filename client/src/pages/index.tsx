import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Fab, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SettingsIcon from '@mui/icons-material/Settings';
import VoiceCommandBar from '../components/common/VoiceCommandBar';
import TaskList from '../components/views/TaskList';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
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

  return (
    <>
      <Head>
        <title>AI Task Manager</title>
        <meta name="description" content="Voice-activated AI task manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Task Manager
          </Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab label="Today" />
            <Tab label="This Week" />
            <Tab label="By Priority" />
            <Tab label="Timeline" />
          </Tabs>
          
          <Box sx={{ p: 2 }}>
            {currentTab === 0 && (
              <TaskList tasks={tasks.filter(task => task.dueDate === '2025-03-29')} />
            )}
            {currentTab === 1 && (
              <TaskList tasks={tasks} />
            )}
            {currentTab === 2 && (
              <TaskList tasks={tasks.sort((a, b) => {
                const priorityValues = { high: 3, medium: 2, low: 1 };
                return priorityValues[b.priority] - priorityValues[a.priority];
              })} />
            )}
            {currentTab === 3 && (
              <Typography variant="body1">Timeline view coming soon</Typography>
            )}
          </Box>
        </Paper>

        <VoiceCommandBar isRecording={isRecording} />

        <Fab 
          color="primary" 
          aria-label="voice command"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={toggleRecording}
        >
          <MicIcon />
        </Fab>
      </Container>
    </>
  );
}
