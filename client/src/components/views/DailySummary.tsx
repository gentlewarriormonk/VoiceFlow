import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import ApiService from '../../services/ApiService';
import AudioPlayer from '../common/AudioPlayer';

interface DailySummaryProps {
  onClose: () => void;
}

const DailySummary = ({ onClose }: DailySummaryProps) => {
  const [summary, setSummary] = useState<{
    summary: string;
    audioUrl?: string;
    taskCount: number;
    highPriorityCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playAudio, setPlayAudio] = useState(false);

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock summary data
      const mockSummary = {
        summary: "Good morning! You have 4 tasks scheduled for today, including 2 high priority tasks. Here are your upcoming tasks: Team meeting at 14:00, Complete project proposal, Review quarterly results. And 1 more task.",
        taskCount: 4,
        highPriorityCount: 2
      };
      
      setSummary(mockSummary);
      setPlayAudio(true);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      setError('Failed to load your daily summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preparing your daily summary...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <div className="loading-spinner"></div>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchDailySummary}>
          Try Again
        </Button>
        <Button variant="text" onClick={onClose} sx={{ ml: 2 }}>
          Close
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Daily Summary
      </Typography>
      
      {summary && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {summary.summary}
            </Typography>
            
            {playAudio && (
              <AudioPlayer 
                text={summary.summary} 
                autoPlay={true}
                onPlayComplete={() => setPlayAudio(false)}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              icon={<CalendarTodayIcon />} 
              label={`${summary.taskCount} Tasks Today`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<FlagIcon />} 
              label={`${summary.highPriorityCount} High Priority`} 
              color="error" 
              variant="outlined"
            />
            <Chip 
              icon={<AccessTimeIcon />} 
              label="Next: Team Meeting (2:00 PM)" 
              color="secondary" 
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="text" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="contained" 
              sx={{ ml: 2 }}
              onClick={() => setPlayAudio(true)}
            >
              Read Aloud
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default DailySummary;
