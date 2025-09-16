const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const Donation = require('../models/Donations');

// Donation routes with explicit handling for each type
router.post('/money', donationController.createDonation);
router.post('/food', donationController.createDonation);
router.post('/clothes', donationController.createDonation);
router.post('/books', donationController.createDonation);
router.post('/health', donationController.createDonation);

// Get donations by facility
router.get('/facility/:facilityId', donationController.getDonationsByFacility);

// Update donation status
router.put('/:donationId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Donation.findByIdAndUpdate(
      req.params.donationId,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Donation status update error:', err); // Add this line
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all pending donations for transport requests
router.get('/pending', async (req, res) => {
  try {
    const donations = await Donation.find({ status: "pending" });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a donation by ID
router.delete('/:id', async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;