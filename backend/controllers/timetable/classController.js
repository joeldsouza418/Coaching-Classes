const Class = require('../../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { grade, stream, students = [], teachers = [] } = req.body;

    const newClass = await Class.create({ grade, stream, students, teachers });
    res.status(201).json({ message: 'Class created successfully', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('students', 'name email').populate('teachers', 'name email');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Update a class by ID
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Class.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ message: 'Class updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Class.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};
