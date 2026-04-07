const jwtUtil = require('../config/jwt');
const mockAuthStore = require('../store/mockAuthStore');

let User;
try { User = require('../models/User'); } catch (_) {}

const isMockMode = () => process.env.MOCK_AUTH === 'true';

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwtUtil.verify(token);

    if (isMockMode()) {
      // In mock mode resolve from in-memory store by id
      const allUsers = await mockAuthStore.getAll();
      const user = allUsers.find(u => u._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      req.user = user;
      return next();
    }

    // DB mode: load from DB but enrich with facultyProfileId from token
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Attach facultyProfileId from the token payload (already validated at login time)
    req.user = {
      ...user,
      facultyProfileId: decoded.facultyProfileId || (user.facultyProfileId ? user.facultyProfileId.toString() : null)
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
