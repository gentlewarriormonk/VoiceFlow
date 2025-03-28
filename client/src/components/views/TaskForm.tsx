import { useState } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const TaskForm = ({ open, onClose, onSubmit, initialData = {}, isEditing = false }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate ? new Date(initialData.dueDate) : null);
  const [time, setTime] = useState(initialData.time ? new Date(`2025-01-01T${initialData.time}`) : null);
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [project, setProject] = useState(initialData.project || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formattedTime = time ? 
        `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}` : 
        undefined;
      
      const formattedDate = dueDate ? 
        dueDate.toISOString().split('T')[0] : 
        undefined;
      
      onSubmit({
        title,
        description,
        dueDate: formattedDate,
        time: formattedTime,
        priority,
        project,
        status: initialData.status || 'not_started'
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                sx={{ flex: 1 }}
              />
              
              <TimePicker
                label="Time"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                sx={{ flex: 1 }}
              />
            </Box>
          </LocalizationProvider>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            margin="normal"
            placeholder="e.g., Marketing, Personal, Work"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
