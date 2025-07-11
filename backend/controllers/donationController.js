const Donation = require('../models/Donations');
const Facility = require('../models/Facility');
const mongoose = require('mongoose');

exports.createDonation = async (req, res) => {
    try {
        const donationType = req.path.split('/')[1];
        const { donorName, phone, facilityId, quantity, pickupAddress } = req.body;

        console.log('Received facilityId:', facilityId); // Debug log

        // Basic validation
        if (!donorName || !phone || !facilityId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: donor name, phone, and facility are required'
            });
        }

        // Handle numeric facility IDs
        const facilityIdString = String(facilityId);
        
        // Create a proper MongoDB ObjectId
        let validFacilityId;
        try {
            // If it's already a valid ObjectId, use it directly
            if (mongoose.Types.ObjectId.isValid(facilityIdString)) {
                validFacilityId = new mongoose.Types.ObjectId(facilityIdString);
            } else {
                // If it's a simple number, pad it to create a valid ObjectId
                const paddedId = facilityIdString.padStart(24, '0');
                validFacilityId = new mongoose.Types.ObjectId(paddedId);
            }
        } catch (error) {
            console.error('Facility ID conversion error:', error);
            return res.status(400).json({
                success: false,
                message: 'Invalid facility ID format',
                details: { providedId: facilityId }
            });
        }

        const donation = new Donation({
            donorName,
            phone,
            type: donationType,
            quantity: parseInt(quantity) || 0,
            pickupAddress,
            facility: validFacilityId,
            status: 'pending',
            ...req.body
        });

        const savedDonation = await donation.save();
        
        res.status(201).json({
            success: true,
            message: 'Your donation has been submitted successfully! We will contact you for collection.',
            donation: savedDonation
        });

    } catch (error) {
        console.error('Donation Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit donation',
            details: error.errors
        });
    }
};

exports.getDonationsByFacility = async (req, res) => {
    try {
        const { facilityId } = req.params;
        
        // Log the received facility ID
        console.log('Fetching donations for facility:', facilityId);

        // Convert numeric ID to ObjectId format
        let validFacilityId;
        try {
            const facilityIdString = String(facilityId);
            if (mongoose.Types.ObjectId.isValid(facilityIdString)) {
                validFacilityId = new mongoose.Types.ObjectId(facilityIdString);
            } else {
                // Pad numeric IDs to create valid ObjectId
                const paddedId = facilityIdString.padStart(24, '0');
                validFacilityId = new mongoose.Types.ObjectId(paddedId);
            }
        } catch (error) {
            console.error('Facility ID conversion error:', error);
            return res.status(400).json({
                success: false,
                message: 'Invalid facility ID format',
                details: { providedId: facilityId }
            });
        }

        // Find donations with proper error handling
        const donations = await Donation.find({ 
            facility: validFacilityId 
        }).sort({ createdAt: -1 });

        // Send response
        res.json({
            success: true,
            donations: donations
        });

    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donations',
            error: error.message
        });
    }
};

exports.updateDonationStatus = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { status } = req.body;

        const donation = await Donation.findByIdAndUpdate(
            donationId,
            { status: status },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        res.json({
            success: true,
            message: 'Donation status updated successfully',
            donation
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update donation status'
        });
    }
};