import express from 'express';
import * as recommendController from '../controllers/recommendController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, recommendController.getRecommendations);
router.post('/chat', recommendController.chatbotQuery);

export default router;