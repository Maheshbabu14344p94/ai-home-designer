import HomeDesign from '../models/HomeDesign.js';

export const createDesign = async (designData, imagePath, architectId) => {
  const design = new HomeDesign({
    ...designData,
    imagePath,
    architectId,
  });

  await design.save();
  return design;
};

export const getAllDesigns = async (filters = {}) => {
  const query = {};

  if (filters.style) query.style = filters.style;
  if (filters.maxBudget) query.budgetMax = { $lte: filters.maxBudget };
  if (filters.minBudget) query.budgetMin = { $gte: filters.minBudget };
  if (filters.vastuCompliant !== undefined) query.vastuCompliant = filters.vastuCompliant;

  return await HomeDesign.find(query).populate('architectId', 'name email');
};

export const getDesignById = async (id) => {
  return await HomeDesign.findById(id).populate('architectId', 'name email');
};

export const updateDesign = async (id, updates) => {
  return await HomeDesign.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteDesign = async (id) => {
  return await HomeDesign.findByIdAndDelete(id);
};

export const getArchitectDesigns = async (architectId) => {
  return await HomeDesign.find({ architectId });
};