// src/routes/statsRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getStats);

module.exports = router;