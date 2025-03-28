import axios from 'axios';

/**
 * Service for handling API requests to the backend
 */
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  // Task API methods
  async getTasks() {
    try {
      const response = await axios.get(`${this.baseUrl}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async createTask(taskData: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, taskData: any) {
    try {
      const response = await axios.put(`${this.baseUrl}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  // Voice API methods
  async transcribeAudio(audioData: Blob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioData);
      
      const response = await axios.post(`${this.baseUrl}/voice/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async synthesizeSpeech(text: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/voice/synthesize`, { text });
      return response.data;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  // AI API methods
  async processCommand(text: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/process`, { text });
      return response.data;
    } catch (error) {
      console.error('Error processing command:', error);
      throw error;
    }
  }

  async getChatbotResponse(message: string, conversationHistory: any[] = []) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/chat`, { 
        message, 
        conversationHistory 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      throw error;
    }
  }

  // Webhook API methods
  async triggerWorkflow(workflowId: string, data: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/webhooks/trigger`, {
        workflowId,
        data
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error triggering workflow ${workflowId}:`, error);
      throw error;
    }
  }
}

export default new ApiService();
