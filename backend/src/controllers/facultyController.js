const Faculty = require('../models/Faculty');

exports.getAll = async (req, res, next) => {
  try {
    const list = await Faculty.find();
    res.json(list);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const f = new Faculty(req.body);
    await f.save();
    res.status(201).json(f);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const f = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(f);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
