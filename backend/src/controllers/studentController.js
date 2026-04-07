const Student = require('../models/Student');
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
    return res.json(mockDataStore.getStudents());
  }
  if (!dbCheck(res)) return;
  try {
    const list = await Student.find();
    res.json(list);
  } catch (err) { next(err); }
};

exports.toggleBlock = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const s = mockDataStore.toggleStudentBlock(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    return res.json(s);
  }
  if (!dbCheck(res)) return;
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    s.blocked = !s.blocked;
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};
