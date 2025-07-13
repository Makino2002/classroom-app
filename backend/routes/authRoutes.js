const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/createAccessCode', authController.createAccessCode);
router.post('/validateAccessCode', authController.validateAccessCode);

module.exports = router;
