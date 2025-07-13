const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController.js');

router.post('/loginEmail', studentController.loginEmail);
router.post('/validateAccessCode', studentController.validateAccessCode);
router.get('/myLessons', studentController.getMyLessons);
router.post('/markLessonDone', studentController.markLessonDone);
router.put('/editProfile', studentController.editProfile);

module.exports = router;
