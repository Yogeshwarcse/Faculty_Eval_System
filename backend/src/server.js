require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cors = require('./config/cors');
const errorHandler = require('./utils/errorHandler');
const rateLimiter = require('./utils/rateLimiter');

// routes
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/students');
const feedbackRoutes = require('./routes/feedback');

// connect database
connectDB();

app.use(rateLimiter);
app.use(cors);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
