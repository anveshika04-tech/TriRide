const axios = require('axios');
const captainModel = require('../models/captain.model');

// Add proxy configuration for Google Maps API
const googleMapsAxios = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        console.error('Google Maps API key is missing');
        throw new Error('Maps configuration error');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        console.log('Fetching coordinates for:', address);
        const response = await axios.get(url);
        
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            console.log('Coordinates found:', location);
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Google API Error:', response.data.status, response.data.error_message);
            throw new Error('Unable to fetch coordinates: ' + response.data.status);
        }
    } catch (error) {
        console.error('Geocoding Error:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        throw new Error('Failed to fetch coordinates');
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        console.error('Google Maps API key is missing');
        throw new Error('Maps configuration error');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        console.log('Fetching distance/time for:', { origin, destination });
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];
            
            if (element.status === 'OK') {
                console.log('Distance/Time found:', element);
                return element;
            } else {
                console.error('Route Error:', element.status);
                throw new Error('No route found between locations');
            }
        } else {
            console.error('Google API Error:', response.data.status, response.data.error_message);
            throw new Error('Unable to calculate distance/time: ' + response.data.status);
        }
    } catch (err) {
        console.error('Distance Matrix Error:', err.message);
        if (err.response) {
            console.error('API Response:', err.response.data);
        }
        throw new Error('Failed to calculate trip details');
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Input is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        console.error('Google Maps API key is missing');
        throw new Error('Maps configuration error');
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:IN&types=geocode`;

    try {
        console.log('Fetching suggestions for:', input);
        const response = await googleMapsAxios.get(url);
        
        if (response.data.status === 'OK') {
            const suggestions = response.data.predictions.map(prediction => ({
                description: prediction.description,
                placeId: prediction.place_id
            }));
            console.log('Suggestions found:', suggestions.length);
            return suggestions;
        } else {
            console.error('Google API Error:', response.data.status, response.data.error_message);
            throw new Error('Unable to fetch suggestions: ' + response.data.status);
        }
    } catch (err) {
        console.error('AutoComplete Error:', err.message);
        if (err.response) {
            console.error('API Response:', err.response.data);
        }
        throw new Error('Failed to fetch location suggestions');
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}