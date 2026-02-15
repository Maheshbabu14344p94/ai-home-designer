import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import HomeDesign from './models/HomeDesign.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await HomeDesign.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create sample architects
    const architect1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@architect.com',
      password: 'password123',
      role: 'architect',
    });

    const architect2 = await User.create({
      name: 'Priya Singh',
      email: 'priya@architect.com',
      password: 'password123',
      role: 'architect',
    });

    console.log('👥 Created sample architects');

    // Create sample designs
    const designs = [
      {
        architectId: architect1._id,
        modelName: 'Modern Villa A',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Modern',
        floors: 2,
        budgetMin: 2500000,
        budgetMax: 5000000,
        landSizeRequired: 5000,
        vastuCompliant: true,
        description: 'A stunning modern villa with open spaces and natural light',
        amenities: ['Garden', 'Garage', 'Home Theater'],
      },
      {
        architectId: architect1._id,
        modelName: 'Traditional Heritage Home',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1d?w=500&q=80',
        style: 'Traditional',
        floors: 2,
        budgetMin: 1500000,
        budgetMax: 3500000,
        landSizeRequired: 4000,
        vastuCompliant: true,
        description: 'A beautiful traditional home with classic architecture',
        amenities: ['Garden', 'Courtyard', 'Porch'],
      },
      {
        architectId: architect2._id,
        modelName: 'Contemporary Minimalist',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Minimalist',
        floors: 2,
        budgetMin: 2000000,
        budgetMax: 4500000,
        landSizeRequired: 3500,
        vastuCompliant: false,
        description: 'Clean lines and minimal design for modern living',
        amenities: ['Smart Home', 'Garage', 'Balcony'],
      },
      {
        architectId: architect2._id,
        modelName: 'Rustic Farmhouse',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1d?w=500&q=80',
        style: 'Rustic',
        floors: 1,
        budgetMin: 1000000,
        budgetMax: 2500000,
        landSizeRequired: 6000,
        vastuCompliant: true,
        description: 'Cozy rustic home with natural materials',
        amenities: ['Garden', 'Patio', 'Barn'],
      },
      {
        architectId: architect1._id,
        modelName: 'Colonial Elegance',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Colonial',
        floors: 3,
        budgetMin: 4000000,
        budgetMax: 8000000,
        landSizeRequired: 7000,
        vastuCompliant: false,
        description: 'Grand colonial mansion with timeless appeal',
        amenities: ['Garden', 'Library', 'Pool', 'Garage'],
      },
      {
        architectId: architect2._id,
        modelName: 'Contemporary Urban Loft',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Contemporary',
        floors: 2,
        budgetMin: 2200000,
        budgetMax: 4200000,
        landSizeRequired: 3000,
        vastuCompliant: false,
        description: 'Spacious loft with industrial touches',
        amenities: ['Rooftop Terrace', 'Gym', 'Parking'],
      },
      {
        architectId: architect1._id,
        modelName: 'Vastu Modern Home',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1d?w=500&q=80',
        style: 'Modern',
        floors: 2,
        budgetMin: 3000000,
        budgetMax: 5500000,
        landSizeRequired: 5500,
        vastuCompliant: true,
        description: 'Modern home designed with Vastu principles',
        amenities: ['Garden', 'Puja Room', 'Garage'],
      },
      {
        architectId: architect2._id,
        modelName: 'Budget Friendly Home',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Traditional',
        floors: 1,
        budgetMin: 800000,
        budgetMax: 1500000,
        landSizeRequired: 2500,
        vastuCompliant: true,
        description: 'Affordable yet beautiful home for small families',
        amenities: ['Garden', 'Storage'],
      },
      {
        architectId: architect1._id,
        modelName: 'Luxury Contemporary',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1d?w=500&q=80',
        style: 'Contemporary',
        floors: 3,
        budgetMin: 5000000,
        budgetMax: 10000000,
        landSizeRequired: 8000,
        vastuCompliant: false,
        description: 'Ultra-modern luxury home with premium amenities',
        amenities: ['Pool', 'Home Theater', 'Gym', 'Garage', 'Garden'],
      },
      {
        architectId: architect2._id,
        modelName: 'Minimalist Zen Home',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
        style: 'Minimalist',
        floors: 1,
        budgetMin: 1800000,
        budgetMax: 3200000,
        landSizeRequired: 3000,
        vastuCompliant: true,
        description: 'Peaceful and serene minimalist dwelling',
        amenities: ['Meditation Room', 'Garden', 'Outdoor Space'],
      },
    ];

    await HomeDesign.insertMany(designs);
    console.log('🏠 Created 10 sample home designs');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();