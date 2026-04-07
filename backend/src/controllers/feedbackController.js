const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');
const mockDataStore = require('../store/mockDataStore');

const dbCheck = (res) => {
  if (mongoose.connection.readyState !== 1) {
    if (process.env.MOCK_AUTH === 'true') {
      return true; // Allow in mock mode
    }
    res.status(503).json({ message: 'Database not available. Please check your MongoDB Atlas IP whitelist and restart the server.' });
    return false;
  }
  return true;
};

exports.getAll = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    return res.json(mockDataStore.getFeedback());
  }
  if (!dbCheck(res)) return;
  try {
    const list = await Feedback.find()
      .populate('studentId', 'name email department')
      .populate('facultyId', 'name department')
      .lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const { studentId, facultyId, ratings, comment } = req.body;
    const newFb = mockDataStore.addFeedback({ studentId, facultyId, ratings, comment });
    return res.status(201).json(newFb);
  }
  if (!dbCheck(res)) return;
  try {
    const { studentId, facultyId, ratings, comment } = req.body;

    if (!studentId) return res.status(400).json({ message: 'Student ID is required' });
    if (!facultyId) return res.status(400).json({ message: 'Faculty ID is required' });
    if (!ratings) return res.status(400).json({ message: 'Ratings are required' });

    const validatedRatings = {};
    const requiredRatings = ['teaching', 'knowledge', 'communication', 'punctuality'];

    for (let key of requiredRatings) {
      const value = Number(ratings[key]);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        return res.status(400).json({
          message: `Rating for ${key} must be an integer between 1 and 5`
        });
      }
      validatedRatings[key] = value;
    }

    const feedbackData = {
      studentId,
      facultyId,
      ratings: validatedRatings,
      comment: comment || '',
      submittedAt: req.body.submittedAt ? new Date(req.body.submittedAt) : new Date()
    };

    const fb = new Feedback(feedbackData);
    const savedFeedback = await fb.save();

    await savedFeedback.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'facultyId', select: 'name' }
    ]);

    res.status(201).json(savedFeedback);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(err);
  }
};

exports.getByFaculty = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const fb = mockDataStore.getFeedback().filter(f => f.facultyId === req.params.facultyId);
    return res.json(fb);
  }
  if (!dbCheck(res)) return;
  try {
    const facultyId = req.params.facultyId;
    const feedback = await Feedback.find({ facultyId })
      .populate('studentId', 'name email')
      .lean();
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.getByStudent = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const fb = mockDataStore.getFeedback().filter(f => f.studentId === req.params.studentId);
    return res.json(fb);
  }
  if (!dbCheck(res)) return;
  try {
    const studentId = req.params.studentId;
    const feedback = await Feedback.find({ studentId })
      .populate('facultyId', 'name department')
      .lean();
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};
