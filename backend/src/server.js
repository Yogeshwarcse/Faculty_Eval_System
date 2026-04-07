const mongoose = require('mongoose');
require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/database');
const seedDemoUsers = require('./config/seedDemoUsers');
const cors = require('./config/cors');
const errorHandler = require('./utils/errorHandler');
const rateLimiter = require('./utils/rateLimiter');

// Routes
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/students');
const feedbackRoutes = require('./routes/feedback');

// --- DB availability flag ---
let dbConnected = false;

// Middleware that blocks routes requiring DB when offline (unless MOCK_AUTH is true)
const dbGuard = (req, res, next) => {
  if (!dbConnected && process.env.MOCK_AUTH !== 'true') {
    return res.status(503).json({
      message: 'Database not available. Please check your MongoDB Atlas IP whitelist and restart the server.'
    });
  }
  next();
};

app.use(rateLimiter);
app.use(cors);
app.use(express.json());

// Auth routes work in both MOCK and DB mode
app.use('/api/auth', authRoutes);

// DB-dependent routes — guarded by dbGuard middleware
app.use('/api/faculty', dbGuard, facultyRoutes);
app.use('/api/students', dbGuard, studentRoutes);
app.use('/api/feedback', dbGuard, feedbackRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DB_CONNECT_TIMEOUT_MS = Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5000;

const withTimeout = (promise, ms, label) => Promise.race([
  promise,
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  })
]);

const startServer = async () => {
  try {
    process.env.MOCK_AUTH = 'false';
    try {
      await withTimeout(connectDB(), DB_CONNECT_TIMEOUT_MS, 'Database connection');
      dbConnected = true;
      await withTimeout(seedDemoUsers(), DB_CONNECT_TIMEOUT_MS, 'Demo user seeding');
      console.log('MongoDB connected successfully');
    } catch (err) {
      process.env.MOCK_AUTH = 'true';
      dbConnected = false;
      // Close any stale connections to prevent buffering hangs
      try { await mongoose.connection.close(); } catch (_) {}
      console.warn(`[DB] ${err.message}`);
      console.warn('[DB] Starting in MOCK_AUTH mode. The application will function in-memory.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (MOCK_AUTH=${process.env.MOCK_AUTH}, DB=${dbConnected})`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set PORT in backend/.env.`);
        process.exit(1);
      }
      console.error('Server startup error:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

startServer();
