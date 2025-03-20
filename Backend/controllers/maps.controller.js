const mapsService = require('../services/maps.service');

module.exports.getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;
        
        if (!address) {
            return res.status(400).json({
                message: 'Address is required'
            });
        }

        const coordinates = await mapsService.getAddressCoordinate(address);
        return res.json(coordinates);
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return res.status(500).json({
            message: 'Failed to get coordinates',
            error: error.message
        });
    }
};

module.exports.getDistanceTime = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        
        if (!origin || !destination) {
            return res.status(400).json({
                message: 'Both origin and destination are required'
            });
        }

        const distanceTime = await mapsService.getDistanceTime(origin, destination);
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
        const suggestions = await mapsService.getAutoCompleteSuggestions(input);
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
