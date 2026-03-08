// placeholder for request validation helpers
module.exports = {
  requireFields: (fields) => (req, res, next) => {
    for (let f of fields) {
      if (!(f in req.body)) return res.status(400).json({ message: `${f} is required` });
    }
    next();
  }
};
