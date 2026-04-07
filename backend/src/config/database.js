const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env');
  }

  // Ensure 10s hangs don't happen if the database is offline
  mongoose.set('bufferCommands', false);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

module.exports = connectDB;
