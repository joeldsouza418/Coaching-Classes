const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema(
  {
    grade: { type: String, enum: ["11", "12"], required: true },       // e.g., "11" or "12"
    stream: { type: String, enum: ["NEET", "JEE"], required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Optional compound index to enforce unique grade + section + stream
ClassSchema.index({ grade: 1, stream: 1 }, { unique: true });

module.exports = mongoose.model('Class', ClassSchema);
