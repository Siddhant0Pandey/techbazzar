# MongoDB Setup Guide for TechBazaar

## 🔄 Current Status: Using In-Memory Database (Data Not Persisted)

Your application is currently using an in-memory database, which means:
- ❌ Users registered are not saved permanently
- ❌ Products are not loaded from a real database
- ❌ All data is lost when the server restarts

## 🎯 Solutions Available

### Option 1: MongoDB Atlas (Cloud Database) - **RECOMMENDED** ⭐

This is the easiest and most reliable option for development and production.

#### Steps:
1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String**
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/techbazaar`)

3. **Update Environment Variables**
   ```bash
   # In your .env file, uncomment and update:
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/techbazaar
   ```

4. **Restart the Server**
   ```bash
   npm run dev
   ```

#### ✅ Advantages:
- No local installation required
- Automatic backups
- Free tier available
- Works from anywhere
- Highly reliable

---

### Option 2: Local MongoDB Installation

#### For Ubuntu/Debian:
```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### For macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### ✅ Advantages:
- Full control over database
- No internet dependency
- Fast local access

#### ❌ Disadvantages:
- Requires local installation
- Manual backup management
- Only accessible locally

---

### Option 3: Docker MongoDB (If Docker Available)

```bash
# Run MongoDB in Docker container
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7.0

# Your connection string would be:
# MONGODB_URI=mongodb://localhost:27017/techbazaar
```

---

## 🚀 Quick Start with MongoDB Atlas (5 minutes)

### Step 1: Create Account and Cluster
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up and create a free cluster
3. Choose AWS/GCP/Azure and select the free tier
4. Wait for cluster creation (2-3 minutes)

### Step 2: Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Create username and password
3. Set permissions to "Read and write to any database"

### Step 3: Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (or add your specific IP)

### Step 4: Get Connection String
1. Go to "Clusters" → "Connect" → "Connect your application"
2. Copy the connection string
3. Replace `<username>`, `<password>`, and `<database>` with your values

### Step 5: Update Your Project
```bash
# Update .env file
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/techbazaar

# Restart your application
npm run dev
```

---

## 🔧 Seeding Initial Data

Once MongoDB is connected, you'll need to populate it with initial data:

### Products Data
The application will automatically create collections, but you might want to add initial products:

```javascript
// You can create a script to populate initial data
// I'll provide this in the next step
```

---

## 🧪 Testing Database Connection

After setting up MongoDB, test the connection:

```bash
# Test server connection
curl http://localhost:5000/api/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test product fetch
curl http://localhost:5000/api/products
```

---

## 🐛 Troubleshooting

### "MongoNetworkError: failed to connect"
- Check MONGODB_URI format
- Verify network access settings in Atlas
- Ensure username/password are correct

### "Authentication failed"
- Double-check username and password
- Ensure user has proper permissions

### "Server still using in-memory database"
- Restart the server after updating .env
- Check for typos in MONGODB_URI
- Look at server console logs for connection errors

---

## 🎯 Recommended Next Steps

1. **Set up MongoDB Atlas** (recommended for quick start)
2. **Update .env file** with your connection string
3. **Restart the application**
4. **Test user registration** and product fetching
5. **Add initial products data** (I'll help with this)

---

## 📞 Need Help?

If you encounter any issues:
1. Check the server console logs
2. Verify your MongoDB connection string
3. Test the connection from MongoDB Compass (GUI tool)
4. Ensure your IP is whitelisted in Atlas

Let me know which option you'd like to proceed with, and I'll help you set it up! 🚀