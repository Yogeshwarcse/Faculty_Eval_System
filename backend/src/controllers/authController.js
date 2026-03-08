const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtUtil = require('../config/jwt');
const mockAuthStore = require('../store/mockAuthStore');

const isMockAuthMode = () => process.env.MOCK_AUTH === 'true';

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, regNo, department, year } = req.body;
    let user = null;

    if (isMockAuthMode()) {
      user = await mockAuthStore.findByEmail(email);
    } else {
      user = await User.findOne({ email });
    }

    if (user) return res.status(400).json({ message: 'Email already registered' });

    if (isMockAuthMode()) {
      user = await mockAuthStore.createUser({ name, email, password, role, regNo, department, year });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashed, role, regNo, department, year });
      await user.save();
    }

    const token = jwtUtil.sign({ id: user._id, role: user.role });

    const userData = isMockAuthMode()
      ? mockAuthStore.toPublicUser(user)
      : user.toObject();

    delete userData.password;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = isMockAuthMode()
      ? await mockAuthStore.findByEmail(email)
      : await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwtUtil.sign({ id: user._id, role: user.role });

    const userData = isMockAuthMode()
      ? mockAuthStore.toPublicUser(user)
      : user.toObject();

    delete userData.password;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};
