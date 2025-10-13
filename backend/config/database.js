const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use your MongoDB Atlas connection string directly
    const mongoURI = 'mongodb+srv://Saransh:Saransh123@cluster0.hzpgrzt.mongodb.net/meditrack?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.warn('⚠️ MongoDB Atlas connection failed - Server will continue with sample data');
    console.warn('Error details:', error.message);
    // Don't exit the process, let the server continue running
  }
};

module.exports = connectDB;
