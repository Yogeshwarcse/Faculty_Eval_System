const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
  customId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String },
  department: String,
  designation: String,
  subjects: [String],
  avatar: String,
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
