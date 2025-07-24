const express = require('express');
const router = express.Router();
const classController = require('../controllers/timetable/classController');
const UserAuth = require('../middleware/userAuth');
const requireRole = require('../middleware/requireRole');

// Create a class
router.post('/create', UserAuth, requireRole(['admin']), classController.createClass);

// Get all classes
router.get('/all', UserAuth, requireRole(['admin']), classController.getAllClasses);

// Optional: Update a class by ID
router.put('/:id', UserAuth, requireRole(['admin']), classController.updateClass);

// Optional: Delete a class by ID
router.delete('/:id', UserAuth, requireRole(['admin']), classController.deleteClass);

module.exports = router;
