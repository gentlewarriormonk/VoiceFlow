import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed';
  project?: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {tasks.length > 0 ? `${tasks.length} Tasks` : 'No Tasks'}
      </Typography>
      
      <List>
        {tasks.map((task) => (
          <ListItem 
            key={task.id}
            sx={{ 
              mb: 1, 
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="complete">
                  <CheckCircleIcon />
                </IconButton>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" component="span">
                    {task.title}
                  </Typography>
                  <Chip 
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                  {task.project && (
                    <Chip 
                      label={task.project}
                      variant="outlined"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {task.dueDate && (
                    <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                      {formatDate(task.dueDate)}
                    </Typography>
                  )}
                  {task.time && (
                    <Typography variant="body2" component="span">
                      {task.time}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
