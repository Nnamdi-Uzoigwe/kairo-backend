// src/routes/reminderRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
} = require('../controllers/reminderController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getReminders);
router.get('/:id', getReminder);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;