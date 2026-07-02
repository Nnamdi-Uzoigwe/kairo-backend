// src/routes/applicationRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const router = express.Router();

// All routes are protected — user must be logged in
router.use(authMiddleware);

router.get('/', getApplications);
router.get('/:id', getApplication);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;