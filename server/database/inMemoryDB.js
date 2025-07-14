// In-memory database for development when MongoDB is not available
let users = [];
let admins = [];
let products = [];
let orders = [];
let categories = [];

// User operations
export const userDB = {
  create: (userData) => {
    const user = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  },
  
  findOne: (query) => {
    return users.find(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
  },
  
  findById: (id) => {
    return users.find(user => user._id === id);
  },
  
  updateOne: (id, updateData) => {
    const userIndex = users.findIndex(user => user._id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
      return users[userIndex];
    }
    return null;
  },
  
  deleteOne: (id) => {
    const userIndex = users.findIndex(user => user._id === id);
    if (userIndex !== -1) {
      return users.splice(userIndex, 1)[0];
    }
    return null;
  }
};

// Admin operations
export const adminDB = {
  create: (adminData) => {
    const admin = {
      _id: Date.now().toString(),
      ...adminData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    admins.push(admin);
    return admin;
  },
  
  findOne: (query) => {
    return admins.find(admin => {
      return Object.keys(query).every(key => admin[key] === query[key]);
    });
  },
  
  findById: (id) => {
    return admins.find(admin => admin._id === id);
  },
  
  updateOne: (id, updateData) => {
    const adminIndex = admins.findIndex(admin => admin._id === id);
    if (adminIndex !== -1) {
      admins[adminIndex] = { ...admins[adminIndex], ...updateData, updatedAt: new Date() };
      return admins[adminIndex];
    }
    return null;
  }
};

// Initialize with default admin accounts
adminDB.create({
  name: 'Super Admin',
  email: 'superadmin@techbazaar.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', // super123
  role: 'super_admin',
  permissions: ['products', 'orders', 'customers', 'analytics', 'settings', 'admin_management'],
  isActive: true
});

adminDB.create({
  name: 'Admin User',
  email: 'admin@techbazaar.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', // admin123
  role: 'admin',
  permissions: ['products', 'orders', 'customers', 'analytics'],
  isActive: true
});

export { users, admins, products, orders, categories };