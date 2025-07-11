const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Remove /auth from these routes since we already prefix with /api/auth in server.js
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;