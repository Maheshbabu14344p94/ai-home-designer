import { recommendDesigns } from '../services/recommendationEngine.js';
import ChatLog from '../models/ChatLog.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { landSize, budgetMin, budgetMax, floors, style, vastuPreference } = req.body;

    // Validate inputs
    if (!landSize || !budgetMin || !budgetMax) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const recommendations = await recommendDesigns({
      landSize: parseInt(landSize),
      budgetMin: parseInt(budgetMin),
      budgetMax: parseInt(budgetMax),
      floors: parseInt(floors) || null,
      style,
      vastuPreference,
    });

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

export const chatbotQuery = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();

    let response = '';
    let category = 'general';

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      response = 'Our designs range from ₹15 Lakhs to ₹1 Crore. You can set your budget range while searching for recommendations!';
      category = 'price';
    } else if (lowerMessage.includes('vastu')) {
      response = 'Yes, we prioritize Vastu-compliant designs. Many of our architects follow Vastu principles. You can filter for Vastu-compliant homes in your search!';
      category = 'vastu';
    } else if (lowerMessage.includes('design') || lowerMessage.includes('style') || lowerMessage.includes('modern') || lowerMessage.includes('traditional')) {
      response = 'We have a wide variety of design styles including Modern, Traditional, Contemporary, Minimalist, Rustic, and Colonial. What style appeals to you?';
      category = 'design';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      response = 'I can help you with information about our designs, pricing, Vastu compliance, and design styles. Feel free to ask anything!';
      category = 'general';
    } else {
      response = 'Thank you for your message! Could you provide more details? I can help with questions about pricing, Vastu compliance, design styles, and more.';
      category = 'other';
    }

    // Save chat log
    const chatLog = new ChatLog({
      userId: req.user?.id || null,
      userMessage: message,
      botResponse: response,
      category,
    });

    await chatLog.save();

    res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};