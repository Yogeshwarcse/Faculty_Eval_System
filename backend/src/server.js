require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/database');
const seedDemoUsers = require('./config/seedDemoUsers');
const cors = require('./config/cors');
const errorHandler = require('./utils/errorHandler');
const rateLimiter = require('./utils/rateLimiter');

// routes
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/students');
const feedbackRoutes = require('./routes/feedback');

app.use(rateLimiter);
app.use(cors);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/feedback', feedbackRoutes);

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
      await withTimeout(seedDemoUsers(), DB_CONNECT_TIMEOUT_MS, 'Demo user seeding');
    } catch (err) {
      process.env.MOCK_AUTH = 'true';
      console.warn(err.message);
      console.warn('Starting with MOCK_AUTH=true. Auth works with demo users; DB-backed routes require MongoDB.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (MOCK_AUTH=${process.env.MOCK_AUTH})`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error('Stop the other process on that port or set PORT in backend/.env.');
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
