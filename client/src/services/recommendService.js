import API from './api';

export const getRecommendations = async (preferences) => {
  try {
    const response = await API.post('/recommend', preferences);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const chatbotQuery = async (message) => {
  try {
    const response = await API.post('/recommend/chat', { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};