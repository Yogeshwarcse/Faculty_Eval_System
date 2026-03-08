const bcrypt = require('bcryptjs');

let initialized = false;
let users = [];

const DEMO_USERS = [
  {
    name: 'Arjun Krishnan',
    email: 'arjun@college.edu',
    password: 'pass123',
    role: 'student',
    regNo: '21CSE001',
    department: 'CSE',
    year: 3,
    blocked: false
  },
  {
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    blocked: false
  }
];

const ensureInitialized = async () => {
  if (initialized) {
    return;
  }

  users = await Promise.all(
    DEMO_USERS.map(async (user, idx) => ({
      ...user,
      _id: `mock-${idx + 1}`,
      password: await bcrypt.hash(user.password, 10)
    }))
  );

  initialized = true;
};

const toPublicUser = (user) => {
  const publicUser = { ...user };
  delete publicUser.password;
  return publicUser;
};

const findByEmail = async (email) => {
  await ensureInitialized();
  return users.find((u) => u.email === email) || null;
};

const createUser = async (payload) => {
  await ensureInitialized();

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = {
    _id: `mock-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    password: hashed,
    role: payload.role || 'student',
    regNo: payload.regNo,
    department: payload.department,
    year: payload.year,
    blocked: false
  };

  users.push(user);
  return user;
};

module.exports = {
  findByEmail,
  createUser,
  toPublicUser
};
