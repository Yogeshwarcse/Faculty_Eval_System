const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env');
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5000
    });
    console.log('MongoDB connected');
  } catch (err) {
    throw new Error(`Database connection error: ${err.message}`);
  }
};

module.exports = connectDB;
