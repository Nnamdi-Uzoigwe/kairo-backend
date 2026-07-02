// src/routes/notificationRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { savePushToken } = require('../controllers/notificationController');

const router = express.Router();

router.use(authMiddleware);
router.post('/push-token', savePushToken);

module.exports = router;