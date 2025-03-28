import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Chip, Grid, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotInterface = ({ isOpen, onClose }: ChatbotInterfaceProps) => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you organize your tasks today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse;
      
      if (inputMessage.toLowerCase().includes('meeting')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Would you like me to schedule a meeting? I can add it to your task list.',
          sender: 'bot' as const,
          timestamp: new Date()
        };
      } else if (inputMessage.toLowerCase().includes('today') || inputMessage.toLowerCase().includes('schedule')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'You have 3 tasks scheduled for today. Your next task is a team meeting at 2pm.',
          sender: 'bot' as const,
          timestamp: new Date()
        };
      } else if (inputMessage.toLowerCase().includes('help')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I can help you manage your tasks. You can ask me to create, update, or complete tasks, or to show you your schedule.',
          sender: 'bot' as const,
          timestamp: new Date()
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I understand. Is there anything specific you\'d like me to help you with regarding your tasks?',
          sender: 'bot' as const,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      
      // Simulate voice response
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recording and transcription
      setTimeout(() => {
        setInputMessage('What tasks do I have scheduled for today?');
        setIsRecording(false);
      }, 2000);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isOpen) return null;
  
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        width: { xs: '90%', sm: 400 },
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatIcon sx={{ mr: 1 }} />
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Messages */}
      <Box
        id="chat-messages"
        sx={{
          p: 2,
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map(message => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                color: message.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: 2
              }}
            >
              {message.sender === 'bot' && isSpeaking && message.id === messages[messages.length - 1].id && (
                <IconButton size="small" sx={{ mr: 1, color: 'primary.main' }}>
                  <VolumeUpIcon />
                </IconButton>
              )}
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                {formatTime(message.timestamp)}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      
      {/* Suggested Actions */}
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={1}>
          <Grid item>
            <Chip 
              label="Show today's tasks" 
              onClick={() => {
                setInputMessage('Show me my tasks for today');
                setTimeout(handleSendMessage, 100);
              }}
              clickable
            />
          </Grid>
          <Grid item>
            <Chip 
              label="Create new task" 
              onClick={() => {
                setInputMessage('I need to create a new task');
                setTimeout(handleSendMessage, 100);
              }}
              clickable
            />
          </Grid>
          <Grid item>
            <Chip 
              label="Help" 
              onClick={() => {
                setInputMessage('What can you help me with?');
                setTimeout(handleSendMessage, 100);
              }}
              clickable
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Listening..." : "Type a message..."}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              outline: 'none'
            }}
            disabled={isRecording}
          />
        </Box>
        <IconButton 
          color={isRecording ? "secondary" : "primary"} 
          onClick={toggleRecording}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>
        <Button 
          variant="contained" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isRecording}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatbotInterface;
