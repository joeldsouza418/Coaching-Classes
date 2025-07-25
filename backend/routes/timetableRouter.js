const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable/timetableController');
const UserAuth = require('../middleware/userAuth');
const requireRole = require('../middleware/requireRole');

// Create or update timetable for a class (for a day)
//router.post('/create', UserAuth, requireRole(['admin']), timetableController.createOrUpdateTimetable);
// Update or create timetable for a specific class & day
router.put('/:classId/:day', UserAuth, requireRole(['admin']), timetableController.createOrUpdateTimetable);


// Get full weekly timetable for a class
router.get('/:classId', UserAuth, requireRole(['admin', 'student', 'teacher']), timetableController.getTimetableByClass);

// Get a teacher's timetable based on teacherId (passed as query param)
router.get('/teacher/timetable', UserAuth, requireRole(['admin', 'teacher']), timetableController.getTeacherTimetable);

module.exports = router;
