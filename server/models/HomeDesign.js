import mongoose from 'mongoose';

const homeDesignSchema = new mongoose.Schema(
  {
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Architect ID is required'],
    },
    modelName: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    imagePath: {
      type: String,
      required: [true, 'Image is required'],
    },
    imageUrl: String, // For external URLs (seed data)
    style: {
      type: String,
      enum: ['Modern', 'Traditional', 'Contemporary', 'Minimalist', 'Rustic', 'Colonial'],
      required: [true, 'Style is required'],
    },
    floors: {
      type: Number,
      required: [true, 'Number of floors is required'],
      min: 1,
      max: 5,
    },
    budgetMin: {
      type: Number,
      required: [true, 'Minimum budget is required'],
    },
    budgetMax: {
      type: Number,
      required: [true, 'Maximum budget is required'],
    },
    landSizeRequired: {
      type: Number,
      required: [true, 'Land size required is required'],
    },
    vastuCompliant: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    amenities: [String], // e.g., ['Garden', 'Garage', 'Pool']
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HomeDesign', homeDesignSchema);