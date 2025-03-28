import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Divider, Button, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ApiService from '../../services/ApiService';

const ProductivityInsights = () => {
  const [insights, setInsights] = useState<{
    mostProductiveDay: string;
    mostProductiveTime: string;
    taskCompletionRate: number;
    averageTasksPerDay: number;
    insights: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductivityInsights();
  }, []);

  const fetchProductivityInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the API service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock insights data
      const mockInsights = {
        mostProductiveDay: 'Tuesday',
        mostProductiveTime: 'Morning (9am-12pm)',
        taskCompletionRate: 0.78,
        averageTasksPerDay: 4.2,
        insights: [
          'You complete 85% more tasks when they are scheduled in the morning',
          'High priority tasks are completed 2.3x faster than medium priority tasks',
          'Tasks with specific times are 65% more likely to be completed than those without'
        ]
      };
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching productivity insights:', error);
      setError('Failed to load productivity insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Analyzing your productivity patterns...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <div className="loading-spinner"></div>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchProductivityInsights}>
          Try Again
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Productivity Insights
      </Typography>
      
      {insights && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Most Productive Day</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, textAlign: 'center' }}>
                  {insights.mostProductiveDay}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimelineIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Most Productive Time</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, textAlign: 'center' }}>
                  {insights.mostProductiveTime}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InsightsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Task Completion Rate</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, textAlign: 'center' }}>
                  {(insights.taskCompletionRate * 100).toFixed(0)}%
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Avg. Tasks Per Day</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, textAlign: 'center' }}>
                  {insights.averageTasksPerDay.toFixed(1)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            Key Insights
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {insights.insights.map((insight, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.03)'
                }}
              >
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body1">{insight}</Typography>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained">
              Get Personalized Recommendations
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProductivityInsights;
