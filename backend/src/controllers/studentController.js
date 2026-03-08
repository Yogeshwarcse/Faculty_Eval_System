const Student = require('../models/Student');

exports.getAll = async (req, res, next) => {
  try {
    const list = await Student.find();
    res.json(list);
  } catch (err) { next(err); }
};

exports.toggleBlock = async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    s.blocked = !s.blocked;
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};
