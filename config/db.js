const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://chemistseridah_db_user:m5pBLBogNk9Ov714@cluster0.5pw7hqj.mongodb.net/?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
      if (typeof serverStatus !== 'undefined') {
        serverStatus.services.database = true;
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      if (typeof serverStatus !== 'undefined') {
        serverStatus.services.database = false;
      }
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      if (typeof serverStatus !== 'undefined') {
        serverStatus.services.database = false;
      }
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:'.red, error);
    process.exit(1);
  }
};

module.exports = connectDB;