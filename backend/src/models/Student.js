const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: String,
  email: String,
  regNo: String,
  department: String,
  year: Number,
  blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', StudentSchema);
