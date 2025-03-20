const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.getFare = async (req, res) => {
    try {
        const { pickup, destination } = req.query;
        
        if (!pickup || !destination) {
            return res.status(400).json({
                message: 'Pickup and destination locations are required'
            });
        }

        console.log('Getting fare for:', { pickup, destination });
        const fare = await rideService.getFare(pickup, destination);
        console.log('Calculated fare:', fare);

        return res.json({
            solo: fare.solo,
            share: fare.share,
            distance: fare.distance,
            duration: fare.duration
        });
    } catch (error) {
        console.error('Fare calculation error:', error);
        return res.status(500).json({
            message: 'Failed to calculate fare',
            error: error.message
        });
    }
};

module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination, vehicleType } = req.body;
        const userId = req.user.id;

        if (!pickup || !destination || !vehicleType) {
            return res.status(400).json({
                message: 'Pickup, destination and vehicle type are required'
            });
        }

        if (!['solo', 'share'].includes(vehicleType)) {
            return res.status(400).json({
                message: 'Invalid vehicle type'
            });
        }

        console.log('Creating ride:', { pickup, destination, vehicleType, userId });
        const ride = await rideService.createRide(userId, pickup, destination, vehicleType);
        console.log('Ride created:', ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.ltd, 
            pickupCoordinates.lng, 
            2
        );

        const rideWithUser = await rideModel.findOne({ _id: ride._id })
            .populate('user')
            .select('-otp');

        // Notify nearby captains about the new ride
        captainsInRadius.forEach(captain => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
            }
        });

        return res.json(ride);
    } catch (error) {
        console.error('Create ride error:', error);
        return res.status(500).json({
            message: 'Failed to create ride',
            error: error.message
        });
    }
};

module.exports.confirmRide = async (req, res) => {
    try {
        const { rideId } = req.body;

        if (!rideId) {
            return res.status(400).json({ 
                message: 'Ride ID is required'
            });
        }

        const ride = await rideService.confirmRide({ 
            rideId, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
        }

        return res.json(ride);
    } catch (err) {
        console.error('Error confirming ride:', err);
        return res.status(500).json({ 
            message: 'Error confirming ride',
            error: err.message 
        });
    }
};

module.exports.startRide = async (req, res) => {
    try {
        const { rideId, otp } = req.query;

        if (!rideId || !otp) {
            return res.status(400).json({ 
                message: 'Ride ID and OTP are required'
            });
        }

        const ride = await rideService.startRide({ 
            rideId, 
            otp, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });
        }

        return res.json(ride);
    } catch (err) {
        console.error('Error starting ride:', err);
        return res.status(500).json({ 
            message: 'Error starting ride',
            error: err.message 
        });
    }
};

module.exports.endRide = async (req, res) => {
    try {
        const { rideId } = req.body;

        if (!rideId) {
            return res.status(400).json({ 
                message: 'Ride ID is required'
            });
        }

        const ride = await rideService.endRide({ 
            rideId, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-ended',
                data: ride
            });
        }

        return res.json(ride);
    } catch (err) {
        console.error('Error ending ride:', err);
        return res.status(500).json({ 
            message: 'Error ending ride',
            error: err.message 
        });
    }
};