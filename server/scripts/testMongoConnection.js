import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('❌ No MONGODB_URI found in environment variables');
    console.log('📝 To fix this:');
    console.log('   1. Set up MongoDB Atlas (recommended) or install MongoDB locally');
    console.log('   2. Add MONGODB_URI to your .env file');
    console.log('   3. Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/techbazaar');
    console.log('\n📚 See MONGODB_SETUP_GUIDE.md for detailed instructions');
    return false;
  }

  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`); // Hide password

    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test basic operations
    console.log('🧪 Testing database operations...');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    console.log('\n🎉 MongoDB connection test passed!');
    console.log('💡 You can now:');
    console.log('   • Run "npm run seed" to populate the database');
    console.log('   • Start your application with "npm run dev"');
    console.log('   • Register users and create products');
    
    return true;
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB');
    console.log('🐛 Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication issue:');
      console.log('   • Check your username and password');
      console.log('   • Ensure the user has proper permissions');
    } else if (error.message.includes('network')) {
      console.log('\n🌐 Network issue:');
      console.log('   • Check your internet connection');
      console.log('   • Verify your IP is whitelisted in MongoDB Atlas');
    } else {
      console.log('\n📚 For help, see MONGODB_SETUP_GUIDE.md');
    }
    
    return false;
  } finally {
    await mongoose.disconnect();
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default testConnection;