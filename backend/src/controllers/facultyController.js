const Faculty = require('../models/Faculty');
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');
const mockDataStore = require('../store/mockDataStore');

const dbCheck = (res) => {
  if (mongoose.connection.readyState !== 1) {
    if (process.env.MOCK_AUTH === 'true') {
      return true; // Allow in mock mode
    }
    res.status(503).json({ message: 'Database not available. Please check your MongoDB Atlas IP whitelist and restart the server.' });
    return false;
  }
  return true;
};

exports.getAll = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    return res.json(mockDataStore.getFaculty());
  }
  if (!dbCheck(res)) return;
  try {
    const list = await Faculty.find().lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    return res.status(201).json(mockDataStore.addFaculty(req.body));
  }
  if (!dbCheck(res)) return;
  try {
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    const f = new Faculty(req.body);
    const savedFaculty = await f.save();
    res.status(201).json(savedFaculty);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const f = mockDataStore.updateFaculty(req.params.id, req.body);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    return res.json(f);
  }
  if (!dbCheck(res)) return;
  try {
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    const f = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json(f);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const success = mockDataStore.deleteFaculty(req.params.id);
    if (!success) return res.status(404).json({ message: 'Faculty not found' });
    return res.json({ success: true, message: 'Faculty deleted successfully' });
  }
  if (!dbCheck(res)) return;
  try {
    const f = await Faculty.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
    const f = mockDataStore.getFaculty().find(f => f._id === req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    return res.json(f);
  }
  if (!dbCheck(res)) return;
  try {
    const f = await Faculty.findById(req.params.id);
    if (!f) return res.status(404).json({ message: 'Faculty not found' });
    res.json(f);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/faculty/me/metrics
 * Faculty-only: returns their own aggregated performance metrics.
 * All student-identifiable information is stripped before responding.
 */
exports.getMyMetrics = async (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'faculty') {
    return res.status(403).json({ message: 'Access denied: faculty only' });
  }

  const facultyProfileId = user.facultyProfileId;
  if (!facultyProfileId) {
    return res.status(400).json({ message: 'No faculty profile linked to this account' });
  }

  try {
    // --- MOCK mode path ---
    if (mongoose.connection.readyState !== 1 && process.env.MOCK_AUTH === 'true') {
      const facultyRecord = mockDataStore.getFaculty().find(f => f._id === facultyProfileId);
      if (!facultyRecord) return res.status(404).json({ message: 'Faculty profile not found' });

      const rawFeedback = mockDataStore.getFeedback().filter(f => f.facultyId === facultyProfileId);

      return res.json(buildMetricsResponse(facultyRecord, rawFeedback));
    }

    // --- DB mode path ---
    if (!dbCheck(res)) return;
    const facultyRecord = await Faculty.findById(facultyProfileId).lean();
    if (!facultyRecord) return res.status(404).json({ message: 'Faculty profile not found' });

    // Fetch feedback WITHOUT populating studentId (privacy)
    const rawFeedback = await Feedback.find({ facultyId: facultyProfileId }).lean();

    return res.json(buildMetricsResponse(facultyRecord, rawFeedback));
  } catch (err) {
    next(err);
  }
};

/**
 * Builds the metrics payload — strips all student-identifiable fields.
 */
function buildMetricsResponse(facultyRecord, rawFeedback) {
  const categories = ['teaching', 'knowledge', 'communication', 'punctuality'];
  const totalResponses = rawFeedback.length;

  const sums = { teaching: 0, knowledge: 0, communication: 0, punctuality: 0 };
  rawFeedback.forEach(fb => {
    categories.forEach(cat => {
      sums[cat] += (fb.ratings?.[cat] || 0);
    });
  });

  const avgRatings = {};
  categories.forEach(cat => {
    avgRatings[cat] = totalResponses > 0
      ? Math.round((sums[cat] / totalResponses) * 10) / 10
      : 0;
  });

  const overallAvg = totalResponses > 0
    ? Math.round((categories.reduce((sum, c) => sum + avgRatings[c], 0) / categories.length) * 10) / 10
    : 0;

  // Anonymised comments — NO studentId, name, email, regNo
  const comments = rawFeedback
    .filter(fb => fb.comment && fb.comment.trim().length > 0)
    .map(fb => ({
      text: fb.comment,
      date: fb.submittedAt || null,
      ratings: fb.ratings
    }));

  return {
    faculty: {
      _id: facultyRecord._id,
      name: facultyRecord.name,
      department: facultyRecord.department,
      designation: facultyRecord.designation || null,
      subjects: facultyRecord.subjects || [],
      avatar: facultyRecord.avatar || null
    },
    totalResponses,
    overallAvg,
    avgRatings,
    comments
  };
}
