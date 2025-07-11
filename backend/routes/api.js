const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  registerUser, 
  loginUser
} = require('../controllers/authController');
const {
  getFacilities,
  getFacilityById,
  createDonation
} = require('../controllers/facilityController');

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Facilities routes
router.get('/facilities', getFacilities);
router.get('/facilities/:id', getFacilityById);

// Donation routes (protected)
router.post('/donations', auth, createDonation);

module.exports = router;