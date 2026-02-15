import HomeDesign from '../models/HomeDesign.js';

export const recommendDesigns = async (userPreferences) => {
  const {
    landSize,
    budgetMin,
    budgetMax,
    floors,
    style,
    vastuPreference,
  } = userPreferences;

  // Step 1: Filter designs
  let query = {
    landSizeRequired: { $lte: landSize },
    budgetMin: { $lte: budgetMax },
    budgetMax: { $gte: budgetMin },
  };

  if (floors) {
    query.floors = { $lte: floors };
  }

  let designs = await HomeDesign.find(query).populate('architectId', 'name email');

  if (designs.length === 0) {
    return [];
  }

  // Step 2: Score designs
  const scoredDesigns = designs.map((design) => {
    let score = 70; // Base score

    // Style matching
    if (design.style === style) {
      score += 20;
    }

    // Vastu compliance
    if (vastuPreference === 'strict' && design.vastuCompliant) {
      score += 10;
    } else if (vastuPreference === 'flexible' && design.vastuCompliant) {
      score += 5;
    }

    // Budget fit
    const budgetMid = (design.budgetMin + design.budgetMax) / 2;
    const userMid = (budgetMin + budgetMax) / 2;
    const budgetDiff = Math.abs(budgetMid - userMid) / userMid;
    if (budgetDiff < 0.2) {
      score += 5;
    }

    // Land size fit
    const landDiff = Math.abs(design.landSizeRequired - landSize) / landSize;
    if (landDiff < 0.2) {
      score += 5;
    }

    return {
      ...design.toObject(),
      matchScore: Math.min(score, 100),
    };
  });

  // Step 3: Sort by score
  return scoredDesigns.sort((a, b) => b.matchScore - a.matchScore);
};