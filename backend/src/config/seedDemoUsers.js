const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const mongoose = require('mongoose');

const BASE_DEMO_USERS = [
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

  // Seed base users (student + admin)
  for (const demo of BASE_DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) continue;
    const password = await bcrypt.hash(demo.password, 10);
    await User.create({ ...demo, password });
    console.log(`Seeded demo user: ${demo.email}`);
  }

  // Seed faculty auth users — one per existing Faculty profile (by email match or first available)
  const allFaculty = await Faculty.find().lean();
  for (const facultyProfile of allFaculty) {
    // Derive a demo email: use existing email field or build one from name
    const demoEmail = facultyProfile.email
      || `${facultyProfile.name.split(' ').pop().toLowerCase()}@college.edu`;

    const existing = await User.findOne({ email: demoEmail });
    if (existing) continue;

    const password = await bcrypt.hash('faculty123', 10);
    await User.create({
      name: facultyProfile.name,
      email: demoEmail,
      password,
      role: 'faculty',
      department: facultyProfile.department,
      facultyProfileId: facultyProfile._id
    });
    console.log(`Seeded faculty auth user: ${demoEmail} → profile ${facultyProfile._id}`);
  }
};

module.exports = seedDemoUsers;
