import * as designService from '../services/designService.js';
import HomeDesign from '../models/HomeDesign.js';
import fs from 'fs';
import path from 'path';

const parseBool = (value) => value === true || String(value).toLowerCase() === 'true';
const allowedBhk = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];

export const uploadDesign = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const {
      modelName,
      style,
      bhk,
      floors,
      budgetMin,
      budgetMax,
      landSizeRequired,
      vastuCompliant,
      description,
      location,
      soilTestStructuralDesign,
      highGradeSteelCement,
      superiorWaterproofing,
      doubleGlazedWindowsInsulation,
      extraElectricalConduitsDataCabling,
      properDrainageSystem,
    } = req.body;

    if (
      floors === undefined || floors === '' ||
      budgetMin === undefined || budgetMin === '' ||
      budgetMax === undefined || budgetMax === '' ||
      landSizeRequired === undefined || landSizeRequired === ''
    ) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Required fields: floors, budgetMin, budgetMax, and landSizeRequired',
      });
    }

    const floorsNum = Number(floors);
    const minBudgetNum = Number(budgetMin);
    const maxBudgetNum = Number(budgetMax);
    const landSizeNum = Number(landSizeRequired);

    if (Number.isNaN(floorsNum) || floorsNum < 1) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Floors must be at least 1' });
    }

    if (Number.isNaN(minBudgetNum) || minBudgetNum < 500000) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Minimum budget must be at least 500000' });
    }

    if (Number.isNaN(maxBudgetNum) || maxBudgetNum < minBudgetNum) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Maximum budget must be >= minimum budget' });
    }

    if (Number.isNaN(landSizeNum) || landSizeNum <= 400) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Land size must be greater than 400 sq.ft' });
    }

    if (bhk && !allowedBhk.includes(bhk)) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Invalid BHK value' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const design = await designService.createDesign(
      {
        modelName: modelName || '',
        style: style || 'Modern',
        bhk: bhk || '2BHK',
        floors: floorsNum,
        budgetMin: minBudgetNum,
        budgetMax: maxBudgetNum,
        landSizeRequired: landSizeNum,
        vastuCompliant: parseBool(vastuCompliant),
        description: description || '',
        location: location || '',
        soilTestStructuralDesign: parseBool(soilTestStructuralDesign),
        highGradeSteelCement: parseBool(highGradeSteelCement),
        superiorWaterproofing: parseBool(superiorWaterproofing),
        doubleGlazedWindowsInsulation: parseBool(doubleGlazedWindowsInsulation),
        extraElectricalConduitsDataCabling: parseBool(extraElectricalConduitsDataCabling),
        properDrainageSystem: parseBool(properDrainageSystem),
      },
      imagePath,
      req.user.id
    );

    return res.status(201).json({ success: true, design });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return next(error);
  }
};

export const getAllDesigns = async (req, res, next) => {
  try {
    const filters = {
      style: req.query.style,
      bhk: req.query.bhk,
      maxBudget: Number(req.query.maxBudget) || null,
      minBudget: Number(req.query.minBudget) || null,
      vastuCompliant: req.query.vastuCompliant === 'true' ? true : undefined,
    };

    const designs = await designService.getAllDesigns(filters);
    return res.status(200).json({ success: true, designs });
  } catch (error) {
    return next(error);
  }
};

export const getDesignById = async (req, res, next) => {
  try {
    const design = await designService.getDesignById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    return res.status(200).json({ success: true, design });
  } catch (error) {
    return next(error);
  }
};

export const updateDesign = async (req, res, next) => {
  try {
    const design = await HomeDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    if (design.architectId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this design' });
    }

    const updates = { ...req.body };

    if (updates.bhk !== undefined && !allowedBhk.includes(updates.bhk)) {
      return res.status(400).json({ success: false, message: 'Invalid BHK value' });
    }

    if (updates.floors !== undefined) {
      const val = Number(updates.floors);
      if (Number.isNaN(val) || val < 1) {
        return res.status(400).json({ success: false, message: 'Floors must be at least 1' });
      }
      updates.floors = val;
    }

    if (updates.budgetMin !== undefined) {
      const val = Number(updates.budgetMin);
      if (Number.isNaN(val) || val < 500000) {
        return res.status(400).json({ success: false, message: 'Minimum budget must be at least 500000' });
      }
      updates.budgetMin = val;
    }

    if (updates.budgetMax !== undefined) {
      const val = Number(updates.budgetMax);
      if (Number.isNaN(val)) {
        return res.status(400).json({ success: false, message: 'Maximum budget must be a valid number' });
      }
      updates.budgetMax = val;
    }

    const effectiveBudgetMin =
      updates.budgetMin !== undefined ? updates.budgetMin : Number(design.budgetMin);
    const effectiveBudgetMax =
      updates.budgetMax !== undefined ? updates.budgetMax : Number(design.budgetMax);

    if (effectiveBudgetMax < effectiveBudgetMin) {
      return res.status(400).json({ success: false, message: 'Maximum budget must be >= minimum budget' });
    }

    if (updates.landSizeRequired !== undefined) {
      const val = Number(updates.landSizeRequired);
      if (Number.isNaN(val) || val <= 400) {
        return res.status(400).json({ success: false, message: 'Land size must be greater than 400 sq.ft' });
      }
      updates.landSizeRequired = val;
    }

    [
      'vastuCompliant',
      'soilTestStructuralDesign',
      'highGradeSteelCement',
      'superiorWaterproofing',
      'doubleGlazedWindowsInsulation',
      'extraElectricalConduitsDataCabling',
      'properDrainageSystem',
    ].forEach((key) => {
      if (updates[key] !== undefined) updates[key] = parseBool(updates[key]);
    });

    if (req.file) {
      if (design.imagePath) {
        const oldRelative = String(design.imagePath).replace(/^[/\\]+/, '');
        const oldPath = path.join(process.cwd(), 'server', oldRelative);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.imagePath = `/uploads/${req.file.filename}`;
    }

    const allowedFields = [
      'modelName',
      'style',
      'bhk',
      'floors',
      'budgetMin',
      'budgetMax',
      'landSizeRequired',
      'vastuCompliant',
      'description',
      'location',
      'soilTestStructuralDesign',
      'highGradeSteelCement',
      'superiorWaterproofing',
      'doubleGlazedWindowsInsulation',
      'extraElectricalConduitsDataCabling',
      'properDrainageSystem',
      'imagePath',
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) design[field] = updates[field];
    });

    await design.save();
    await design.populate('architectId', 'name email');

    return res.status(200).json({ success: true, design });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return next(error);
  }
};

export const deleteDesign = async (req, res, next) => {
  try {
    const design = await HomeDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    if (design.architectId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this design' });
    }

    if (design.imagePath) {
      const relativePath = String(design.imagePath).replace(/^[/\\]+/, '');
      const filePath = path.join(process.cwd(), 'server', relativePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await designService.deleteDesign(req.params.id);
    return res.status(200).json({ success: true, message: 'Design deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const getArchitectDesigns = async (req, res, next) => {
  try {
    const designs = await designService.getArchitectDesigns(req.user.id);
    return res.status(200).json({ success: true, designs });
  } catch (error) {
    return next(error);
  }
};