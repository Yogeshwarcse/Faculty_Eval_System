// Validation helpers
module.exports = {
  requireFields: (fields) => (req, res, next) => {
    const missing = fields.filter(f => !(f in req.body));
    if (missing.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}` 
      });
    }
    next();
  },

  validateFacultyData: (req, res, next) => {
    const { name, department, subjects } = req.body;
    
    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Name must be a non-empty string with at least 2 characters' 
      });
    }

    // Validate department
    const validDepts = ['CSE', 'ECE', 'IT', 'MECH', 'CIVIL'];
    if (!department || !validDepts.includes(department)) {
      return res.status(400).json({ 
        message: `Department must be one of: ${validDepts.join(', ')}` 
      });
    }

    // Validate subjects - convert to array if string
    if (subjects) {
      if (typeof subjects === 'string') {
        req.body.subjects = subjects
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else if (Array.isArray(subjects)) {
        req.body.subjects = subjects
          .map(s => String(s).trim())
          .filter(s => s.length > 0);
      }
    } else {
      req.body.subjects = [];
    }

    next();
  },

  validateFeedbackData: (req, res, next) => {
    const { studentId, facultyId, ratings, comment } = req.body;

    // Validate IDs
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    if (!facultyId) {
      return res.status(400).json({ message: 'Faculty ID is required' });
    }

    // Validate IDs are valid MongoDB ObjectIds (Skip if in Mock mode)
    if (process.env.MOCK_AUTH !== 'true') {
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!mongoIdRegex.test(studentId)) {
        return res.status(400).json({ message: 'Invalid Student ID format' });
      }
      if (!mongoIdRegex.test(facultyId)) {
        return res.status(400).json({ message: 'Invalid Faculty ID format' });
      }
    }

    // Validate ratings object exists
    if (!ratings || typeof ratings !== 'object') {
      return res.status(400).json({ message: 'Ratings object is required' });
    }

    // Validate each rating
    const requiredRatings = ['teaching', 'knowledge', 'communication', 'punctuality'];
    for (let key of requiredRatings) {
      const value = Number(ratings[key]);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        return res.status(400).json({ 
          message: `Rating for ${key} must be an integer between 1 and 5` 
        });
      }
      req.body.ratings[key] = value;
    }

    // Validate comment (optional, but max length)
    if (comment && typeof comment === 'string' && comment.length > 1000) {
      return res.status(400).json({ 
        message: 'Comment cannot exceed 1000 characters' 
      });
    }

    // Ensure submittedAt is a valid timestamp if provided
    if (req.body.submittedAt) {
      const date = new Date(req.body.submittedAt);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid submittedAt timestamp' });
      }
      req.body.submittedAt = date;
    }

    next();
  }
};
