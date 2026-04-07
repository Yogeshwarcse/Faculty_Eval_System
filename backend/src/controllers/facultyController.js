const Faculty = require('../models/Faculty');
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
    return res.json(mockDataStore.getFaculty());
  }
  if (!dbCheck(res)) return;
  try {
    const list = await Faculty.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    return res.status(201).json(mockDataStore.addFaculty(req.body));
  }
  if (!dbCheck(res)) return;
  try {
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    const f = new Faculty(req.body);
    const savedFaculty = await f.save();
    res.status(201).json(savedFaculty);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const f = mockDataStore.updateFaculty(req.params.id, req.body);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    return res.json(f);
  }
  if (!dbCheck(res)) return;
  try {
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    const f = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json(f);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const success = mockDataStore.deleteFaculty(req.params.id);
    if (!success) return res.status(404).json({ message: 'Faculty not found' });
    return res.json({ success: true, message: 'Faculty deleted successfully' });
  }
  if (!dbCheck(res)) return;
  try {
    const f = await Faculty.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const f = mockDataStore.getFaculty().find(f => f._id === req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    return res.json(f);
  }
  if (!dbCheck(res)) return;
  try {
    const f = await Faculty.findById(req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json(f);
  } catch (err) {
    next(err);
  }
};
