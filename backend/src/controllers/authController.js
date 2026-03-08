const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtUtil = require('../config/jwt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, regNo, department, year } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role, regNo, department, year });
    await user.save();
    const token = jwtUtil.sign({ id: user._id, role: user.role });
    
    // Return user data without password
    const userData = user.toObject();
    delete userData.password;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwtUtil.sign({ id: user._id, role: user.role });
    
    // Return user data without password
    const userData = user.toObject();
    delete userData.password;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};
