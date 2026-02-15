import express from 'express';
import * as designController from '../controllers/designController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Protected routes - Architect only (SPECIFIC ROUTES FIRST!)
router.get('/architect/my-designs', protect, authorize('architect'), designController.getArchitectDesigns);
router.post('/upload', protect, authorize('architect'), upload.single('image'), designController.uploadDesign);
router.put('/:id', protect, authorize('architect'), upload.single('image'), designController.updateDesign);
router.delete('/:id', protect, authorize('architect'), designController.deleteDesign);

// Public routes (GENERAL ROUTES LAST)
router.get('/', designController.getAllDesigns);
router.get('/:id', designController.getDesignById);

export default router;