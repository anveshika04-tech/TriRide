const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Create the ride first
        const ride = await rideService.createRide(req.user._id, pickup, destination, vehicleType);
        
        try {
            // Get coordinates and find nearby captains
            const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
            const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

            // Get the ride with populated user data
            const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('userId');

            // Send notifications to nearby captains
            captainsInRadius.forEach(captain => {
                if (captain.socketId) {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'new-ride',
                        data: rideWithUser
                    });
                }
            });
        } catch (notificationError) {
            console.error('Error sending notifications:', notificationError);
            // Don't fail the ride creation if notifications fail
        }

        // Send the final response
        return res.status(201).json(ride);

    } catch (err) {
        console.error('Create ride error:', err);
        return res.status(500).json({ 
            message: err.message || 'Failed to create ride',
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.error('Get fare error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        // Ensure captain exists in request
        if (!req.captain) {
            return res.status(401).json({ message: 'Captain authentication required' });
        }

        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // Notify user that ride has been confirmed
        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Confirm ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        // Ensure captain exists in request
        if (!req.captain) {
            return res.status(401).json({ message: 'Captain authentication required' });
        }

        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        // Notify user that ride has started
        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Start ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        // Ensure captain exists in request
        if (!req.captain) {
            return res.status(401).json({ message: 'Captain authentication required' });
        }

        const ride = await rideService.endRide({ rideId, captain: req.captain });

        // Notify user that ride has ended
        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-ended',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('End ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Add a new endpoint to get captain's active ride
module.exports.getCaptainActiveRide = async (req, res) => {
    try {
        if (!req.captain) {
            return res.status(401).json({ message: 'Captain authentication required' });
        }

        const activeRide = await rideModel.findOne({
            captain: req.captain._id,
            status: { $in: ['confirmed', 'started'] }
        }).populate('userId');

        if (!activeRide) {
            return res.status(404).json({ message: 'No active ride found' });
        }

        return res.status(200).json(activeRide);
    } catch (err) {
        console.error('Get active ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Add a new endpoint to get captain's ride history
module.exports.getCaptainRideHistory = async (req, res) => {
    try {
        if (!req.captain) {
            return res.status(401).json({ message: 'Captain authentication required' });
        }

        const rides = await rideModel.find({
            captain: req.captain._id,
            status: 'completed'
        }).populate('userId').sort({ createdAt: -1 }).limit(10);

        return res.status(200).json(rides);
    } catch (err) {
        console.error('Get ride history error:', err);
        return res.status(500).json({ message: err.message });
    }
};