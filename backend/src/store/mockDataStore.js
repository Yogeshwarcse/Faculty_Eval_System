let faculty = [
  {
    _id: 'mock-fac-1',
    customId: 'Ramesh-cse-12',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh@college.edu',
    department: 'CSE',
    designation: 'Professor',
    subjects: ['Operating Systems', 'Data Structures'],
    rating: 4.8,
    avatar: 'RK'
  },
  {
    _id: 'mock-fac-2',
    customId: 'Priya-ece-45',
    name: 'Dr. Priya Singh',
    email: 'priya@college.edu',
    department: 'ECE',
    designation: 'Associate Professor',
    subjects: ['Signals and Systems', 'Microprocessors'],
    rating: 4.5,
    avatar: 'PS'
  }
];

let feedback = [
  {
    _id: 'mock-fb-1',
    studentId: 'mock-1',
    facultyId: 'mock-fac-1',
    ratings: { teaching: 5, knowledge: 5, communication: 4, punctuality: 5 },
    comment: 'Excellent teaching style. Concepts are explained very clearly.',
    submittedAt: new Date('2024-03-10')
  },
  {
    _id: 'mock-fb-2',
    studentId: 'mock-2',
    facultyId: 'mock-fac-1',
    ratings: { teaching: 4, knowledge: 5, communication: 4, punctuality: 3 },
    comment: 'Very knowledgeable but sometimes runs over time.',
    submittedAt: new Date('2024-03-12')
  },
  {
    _id: 'mock-fb-3',
    studentId: 'mock-3',
    facultyId: 'mock-fac-1',
    ratings: { teaching: 5, knowledge: 4, communication: 5, punctuality: 4 },
    comment: 'Great lectures and always available for doubts.',
    submittedAt: new Date('2024-03-15')
  },
  {
    _id: 'mock-fb-4',
    studentId: 'mock-1',
    facultyId: 'mock-fac-2',
    ratings: { teaching: 4, knowledge: 5, communication: 3, punctuality: 4 },
    comment: 'Deep subject knowledge, communication could improve.',
    submittedAt: new Date('2024-03-11')
  },
  {
    _id: 'mock-fb-5',
    studentId: 'mock-2',
    facultyId: 'mock-fac-2',
    ratings: { teaching: 5, knowledge: 5, communication: 4, punctuality: 5 },
    comment: 'One of the best faculty members in the department.',
    submittedAt: new Date('2024-03-14')
  }
];
let students = [
  {
    _id: 'mock-1',
    name: 'Arjun Krishnan',
    email: 'arjun@college.edu',
    role: 'student',
    regNo: '21CSE001',
    department: 'CSE',
    year: 3,
    blocked: false
  }
];

module.exports = {
  getFaculty: () => faculty,
  addFaculty: (f) => {
    const newF = { ...f, _id: `mock-fac-${Date.now()}` };
    faculty.push(newF);
    return newF;
  },
  updateFaculty: (id, data) => {
    const idx = faculty.findIndex(f => f._id === id);
    if (idx === -1) return null;
    faculty[idx] = { ...faculty[idx], ...data };
    return faculty[idx];
  },
  deleteFaculty: (id) => {
    const idx = faculty.findIndex(f => f._id === id);
    if (idx === -1) return false;
    faculty.splice(idx, 1);
    return true;
  },
  getFeedback: () => feedback,
  addFeedback: (fb) => {
    const newFb = { 
      ...fb, 
      _id: `mock-fb-${Date.now()}`,
      submittedAt: new Date()
    };
    feedback.push(newFb);
    return newFb;
  },
  getStudents: () => students,
  addStudent: (s) => {
    const newS = { ...s, _id: `mock-stu-${Date.now()}`, blocked: false };
    students.push(newS);
    return newS;
  },
  toggleStudentBlock: (id) => {
    const s = students.find(s => s._id === id);
    if (s) s.blocked = !s.blocked;
    return s;
  }
};
