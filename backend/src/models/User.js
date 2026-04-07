const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'faculty'], default: 'student' },
  regNo: String,
  department: String,
  year: Number,
  // For faculty users: references the Faculty profile document
  facultyProfileId: { type: Schema.Types.ObjectId, ref: 'Faculty', default: null },
  blocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
