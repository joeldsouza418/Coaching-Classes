const Timetable = require('../../models/Timetable');

// Create or update timetable for a specific class and day
exports.createOrUpdateTimetable = async (req, res) => {
  try {
    const { classId, day } = req.params;
    const schedule = req.body;

    const updated = await Timetable.findOneAndUpdate(
      { classId, day },
      { schedule },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Timetable saved', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error saving timetable', error: error.message });
  }
};

// Get full timetable for a class
exports.getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.find({ classId }).populate('schedule.teacherId');
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error: error.message });
  }
};

// Get timetable for a teacher
exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.query;

    const entries = await Timetable.find({ "schedule.teacherId": teacherId });

    const result = entries.map(entry => ({
      classId: entry.classId,
      day: entry.day,
      periods: entry.schedule.filter(p => p.teacherId.toString() === teacherId)
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher timetable', error: error.message });
  }
};
