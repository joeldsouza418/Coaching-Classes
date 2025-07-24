const Class = require('../../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { grade, stream, students, teachers } = req.body;

    const newClass = await Class.create({ grade, stream, students, teachers });
    res.status(201).json({ message: 'Class created successfully', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('students teachers');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Optional: Update class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Class.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Class updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

// Optional: Delete class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};
