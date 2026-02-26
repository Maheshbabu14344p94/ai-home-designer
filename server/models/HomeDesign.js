import mongoose from 'mongoose';

const homeDesignSchema = new mongoose.Schema(
  {
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Architect ID is required'],
    },

    // Keep optional so only floors/budget/land size are mandatory
    modelName: {
      type: String,
      trim: true,
      default: '',
    },

    imagePath: {
      type: String,
      required: [true, 'Image is required'],
    },

    imageUrl: String, // For external URLs (seed data)

    // Optional
    style: {
      type: String,
      enum: ['Modern', 'Traditional', 'Contemporary', 'Minimalist', 'Rustic', 'Colonial'],
      default: 'Modern',
    },

    // NEW: Optional BHK
    bhk: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'],
      default: '2BHK',
    },

    // Required
    floors: {
      type: Number,
      required: [true, 'Number of floors is required'],
      min: 1,
      max: 5,
    },

    // Required with rule: min >= 500000
    budgetMin: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [500000, 'Minimum budget must be at least 500000'],
    },

    // Required and must be >= budgetMin
    budgetMax: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      validate: {
        validator: function (value) {
          return value >= this.budgetMin;
        },
        message: 'Maximum budget must be greater than or equal to minimum budget',
      },
    },

    // Required with rule: > 400
    landSizeRequired: {
      type: Number,
      required: [true, 'Land size required is required'],
      min: [401, 'Land size must be greater than 400 sq.ft'],
    },

    // Optional
    vastuCompliant: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: '',
    },

    amenities: [String], // e.g., ['Garden', 'Garage', 'Pool']

    // New optional fields
    location: {
      type: String,
      trim: true,
      default: '',
    },
    soilTestStructuralDesign: {
      type: Boolean,
      default: false,
    },
    highGradeSteelCement: {
      type: Boolean,
      default: false,
    },
    superiorWaterproofing: {
      type: Boolean,
      default: false,
    },
    doubleGlazedWindowsInsulation: {
      type: Boolean,
      default: false,
    },
    extraElectricalConduitsDataCabling: {
      type: Boolean,
      default: false,
    },
    properDrainageSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HomeDesign', homeDesignSchema);