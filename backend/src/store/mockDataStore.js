let faculty = [
  {
    _id: 'mock-fac-1',
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
    name: 'Dr. Priya Singh',
    email: 'priya@college.edu',
    department: 'ECE',
    designation: 'Associate Professor',
    subjects: ['Signals and Systems', 'Microprocessors'],
    rating: 4.5,
    avatar: 'PS'
  }
];

let feedback = [];
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
