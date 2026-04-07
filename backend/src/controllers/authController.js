const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const jwtUtil = require('../config/jwt');
const mockAuthStore = require('../store/mockAuthStore');
const mongoose = require('mongoose');

const isMockAuthMode = () => process.env.MOCK_AUTH === 'true';

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, regNo, department, year, facultyProfileId } = req.body;
    let user = null;

    if (isMockAuthMode()) {
      user = await mockAuthStore.findByEmail(email);
    } else {
      user = await User.findOne({ email });
    }

    if (user) return res.status(400).json({ message: 'Email already registered' });

    if (isMockAuthMode()) {
      user = await mockAuthStore.createUser({ name, email, password, role, regNo, department, year, facultyProfileId });
    } else {
      const hashed = await bcrypt.hash(password, 10);

      let resolvedFacultyProfileId = null;

      // If registering as faculty, validate the profile link
      if (role === 'faculty') {
        if (!facultyProfileId) {
          return res.status(400).json({ message: 'Faculty Profile ID is required for faculty registration' });
        }
        
        let profile = null;
        const isObjectId = mongoose.Types.ObjectId.isValid(facultyProfileId);

        // Try searching by customId OR _id (if valid ObjectId)
        const query = isObjectId 
          ? { $or: [{ customId: facultyProfileId }, { _id: facultyProfileId }] }
          : { customId: facultyProfileId };

        profile = await Faculty.findOne(query);

        if (!profile) {
          return res.status(400).json({ message: 'No faculty profile found with that Custom ID or Database ID' });
        }
        resolvedFacultyProfileId = profile._id;
      }

      user = new User({ name, email, password: hashed, role: role || 'student', regNo, department, year, facultyProfileId: resolvedFacultyProfileId });
      await user.save();
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
      facultyProfileId: user.facultyProfileId || null
    };
    const token = jwtUtil.sign(tokenPayload);

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

    const tokenPayload = {
      id: user._id,
      role: user.role,
      facultyProfileId: user.facultyProfileId ? user.facultyProfileId.toString() : null
    };
    const token = jwtUtil.sign(tokenPayload);

    const userData = isMockAuthMode()
      ? mockAuthStore.toPublicUser(user)
      : user.toObject();

    delete userData.password;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};
