const express = require('express');
const router = express.Router();
const classController = require('../controllers/timetable/classController');
const UserAuth = require('../middleware/userAuth');
const requireRole = require('../middleware/requireRole');

// Create new class
router.post('/create', UserAuth, requireRole(['admin']), classController.createClass);

// Get all classes
router.get('/', UserAuth, requireRole(['admin', 'teacher']), classController.getAllClasses);

// Update class by ID
router.put('/:id', UserAuth, requireRole(['admin']), classController.updateClass);

// Delete class by ID
router.delete('/:id', UserAuth, requireRole(['admin']), classController.deleteClass);

module.exports = router;
