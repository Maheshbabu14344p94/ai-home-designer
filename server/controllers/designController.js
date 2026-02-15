import * as designService from '../services/designService.js';
import HomeDesign from '../models/HomeDesign.js';
import fs from 'fs';
import path from 'path';

export const uploadDesign = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { modelName, style, floors, budgetMin, budgetMax, landSizeRequired, vastuCompliant, description } = req.body;

    // Validate required fields
    if (!modelName || !style || !floors || !budgetMin || !budgetMax || !landSizeRequired) {
      // Delete the uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const design = await designService.createDesign(
      {
        modelName,
        style,
        floors: parseInt(floors),
        budgetMin: parseInt(budgetMin),
        budgetMax: parseInt(budgetMax),
        landSizeRequired: parseInt(landSizeRequired),
        vastuCompliant: vastuCompliant === 'true',
        description,
      },
      imagePath,
      req.user.id
    );

    res.status(201).json({ success: true, design });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const getAllDesigns = async (req, res, next) => {
  try {
    const filters = {
      style: req.query.style,
      maxBudget: parseInt(req.query.maxBudget) || null,
      minBudget: parseInt(req.query.minBudget) || null,
      vastuCompliant: req.query.vastuCompliant === 'true' ? true : undefined,
    };

    const designs = await designService.getAllDesigns(filters);
    res.status(200).json({ success: true, designs });
  } catch (error) {
    next(error);
  }
};

export const getDesignById = async (req, res, next) => {
  try {
    const design = await designService.getDesignById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    res.status(200).json({ success: true, design });
  } catch (error) {
    next(error);
  }
};

export const updateDesign = async (req, res, next) => {
  try {
    // Fetch design WITHOUT populate to preserve ObjectId for authorization check
    const design = await HomeDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    // Check if user is the architect who created this design
    if (design.architectId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this design' });
    }

    const updates = { ...req.body };

    if (req.file) {
      // Delete old file
      if (design.imagePath) {
        const oldPath = path.join(process.cwd(), 'server', design.imagePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.imagePath = `/uploads/${req.file.filename}`;
    }

    // Update and populate architect info
    const updatedDesign = await HomeDesign.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('architectId', 'name email');
    res.status(200).json({ success: true, design: updatedDesign });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const deleteDesign = async (req, res, next) => {
  try {
    // Fetch design WITHOUT populate to preserve ObjectId for authorization check
    const design = await HomeDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    // Check if user is the architect who created this design
    if (design.architectId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this design' });
    }

    // Delete image file
    if (design.imagePath) {
      const filePath = path.join(process.cwd(), 'server', design.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await designService.deleteDesign(req.params.id);
    res.status(200).json({ success: true, message: 'Design deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getArchitectDesigns = async (req, res, next) => {
  try {
    const designs = await designService.getArchitectDesigns(req.user.id);
    res.status(200).json({ success: true, designs });
  } catch (error) {
    next(error);
  }
};