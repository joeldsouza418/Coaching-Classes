const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, // Format: "09:00"
    endTime: { type: String, required: true },   // Format: "10:00"
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String },
  },
  { _id: false } // Avoids auto-generating _id for subdocs
);

const TimetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    day: { type: String, required: true }, // e.g., "Monday"
    schedule: [ScheduleSchema],
  },
  { timestamps: true }
);

// Unique index to prevent duplicate (classId + day)
TimetableSchema.index({ classId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
