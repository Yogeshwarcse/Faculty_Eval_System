const User = require('../models/User');
const mongoose = require('mongoose');
const mockAuthStore = require('../store/mockAuthStore');

const dbCheck = (res) => {
  if (mongoose.connection.readyState !== 1) {
    if (process.env.MOCK_AUTH === 'true') {
      return true; // Allow in mock mode
    }
    res.status(503).json({ message: 'Database not available' });
    return false;
  }
  return true;
};

exports.getAll = async (req, res, next) => {
  // If in mock mode AND DB is offline, Use the mockAuthStore
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    // THE FIX: Fetch all mock users instead of hardcoded ones
    const allUsers = await mockAuthStore.getAll();
    return res.json(allUsers.filter(u => u && u.role === 'student'));
  }

  if (!dbCheck(res)) return;

  try {
    const list = await User.find({ role: 'student' }).select('-password').lean();
    res.json(list);
  } catch (err) { 
    next(err); 
  }
};

exports.toggleBlock = async (req, res, next) => {
  if (!dbCheck(res)) return;
  try {
    const s = await User.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    s.blocked = !s.blocked;
    await s.save();
    res.json(s);
  } catch (err) { 
    next(err); 
  }
};
