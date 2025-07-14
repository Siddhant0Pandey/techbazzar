import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techbazaar');
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const superAdmin = new Admin({
      name: 'Super Admin',
      email: 'superadmin@techbazaar.com',
      password: 'super123',
      role: 'super_admin'
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Email: superadmin@techbazaar.com');
    console.log('Password: super123');

    // Create regular admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@techbazaar.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Regular admin created successfully!');
    console.log('Email: admin@techbazaar.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();