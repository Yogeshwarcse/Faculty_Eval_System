const Feedback = require('../models/Feedback');

exports.getAll = async (req, res, next) => {
  try {
    const list = await Feedback.find().populate('studentId').populate('facultyId');
    res.json(list);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const fb = new Feedback(req.body);
    await fb.save();
    res.status(201).json(fb);
  } catch (err) { next(err); }
};

// additional helpers can be added (by student, by faculty)
