const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  facultyId: { type: Schema.Types.ObjectId, ref: 'Faculty' },
  ratings: {
    teaching: Number,
    knowledge: Number,
    communication: Number,
    punctuality: Number
  },
  comment: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
