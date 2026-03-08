const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DEMO_USERS = [
  {
    name: 'Arjun Krishnan',
    email: 'arjun@college.edu',
    password: 'pass123',
    role: 'student',
    regNo: '21CSE001',
    department: 'CSE',
    year: 3
  },
  {
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin'
  }
];

const seedDemoUsers = async () => {
  if (process.env.SEED_DEMO_USERS === 'false') {
    return;
  }

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      continue;
    }

    const password = await bcrypt.hash(demo.password, 10);
    await User.create({ ...demo, password });
    console.log(`Seeded demo user: ${demo.email}`);
  }
};

module.exports = seedDemoUsers;
