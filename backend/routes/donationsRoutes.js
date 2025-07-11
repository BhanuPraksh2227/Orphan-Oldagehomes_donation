const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Donation routes with explicit handling for each type
router.post('/money', donationController.createDonation);
router.post('/food', donationController.createDonation);
router.post('/clothes', donationController.createDonation);
router.post('/books', donationController.createDonation);
router.post('/health', donationController.createDonation);

// Get donations by facility
router.get('/facility/:facilityId', donationController.getDonationsByFacility);

// Update donation status
router.put('/:donationId/status', donationController.updateDonationStatus);

module.exports = router;