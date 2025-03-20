const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Coordinates Error:', error);
        res.status(404).json({ message: 'Coordinates not found', error: error.message });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (err) {
        console.error('Distance Time Error:', err);
        res.status(500).json({ 
            message: 'Failed to calculate distance and time',
            error: err.message 
        });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        if (!input || input.length < 3) {
            return res.status(400).json({ message: 'Please enter at least 3 characters' });
        }

        console.log('Fetching suggestions for input:', input);
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        console.log('Suggestions received:', suggestions.length);
        
        res.status(200).json(suggestions);
    } catch (err) {
        console.error('AutoComplete Controller Error:', err);
        res.status(500).json({ 
            message: 'Failed to get location suggestions',
            error: err.message 
        });
    }
};