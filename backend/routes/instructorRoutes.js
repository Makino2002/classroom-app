const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

router.post('/addStudent', instructorController.addStudent);
router.put('/editStudent/:phone', instructorController.editStudent);
router.delete('/student/:phone', instructorController.deleteStudent);
router.get('/students', instructorController.getStudents);
router.get('/student/:phone', instructorController.getStudentByPhone);
router.post('/assignLesson', instructorController.assignLesson);

module.exports = router;
