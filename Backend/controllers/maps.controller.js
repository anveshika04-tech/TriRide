const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;
        
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }
        
        console.log('Getting coordinates for address:', address);
        
        // Make this endpoint work without authentication
        const coordinates = await mapService.getAddressCoordinate(address);
        
        console.log('Coordinates result:', coordinates);
        
        if (!coordinates) {
            return res.status(404).json({ message: 'Could not find coordinates for the given address' });
        }
        
        return res.status(200).json(coordinates);
    } catch (err) {
        console.error('Get coordinates error:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Completely remove token validation for map endpoints
module.exports.refreshMapToken = async (req, res, next) => {
    // Skip token validation entirely for map endpoints
    next();
};

module.exports.getDistanceTime = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        
        if (!origin || !destination) {
            return res.status(400).json({
                message: 'Both origin and destination are required'
            });
        }

        const distanceTime = await mapService.getDistanceTime(origin, destination);
        return res.json(distanceTime);
    } catch (error) {
        console.error('Error getting distance and time:', error);
        return res.status(500).json({
            message: 'Failed to get distance and time',
            error: error.message
        });
    }
};

module.exports.getSuggestions = async (req, res) => {
    try {
        const { input } = req.query;
        
        if (!input) {
            return res.status(400).json({
                message: 'Input query is required'
            });
        }

        console.log('Getting suggestions for:', input);
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        console.log('Found suggestions:', suggestions);

        return res.json(suggestions);
    } catch (error) {
        console.error('Error getting suggestions:', error);
        return res.status(500).json({
            message: 'Failed to get location suggestions',
            error: error.message
        });
    }
};
