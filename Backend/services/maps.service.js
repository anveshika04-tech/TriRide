const axios = require('axios');

// Add delay between Nominatim API calls to respect rate limits
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Clean address string for Nominatim API
function cleanAddress(address) {
    // Remove special characters and normalize spaces
    return address
        .replace(/['"`]/g, '')
        .replace(/[^\w\s,-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Extract main location from address
function getMainLocation(address) {
    const parts = address.split(',').map(part => part.trim());
    // Take first significant part and add India
    return parts[0] + ', India';
}

async function getAutoCompleteSuggestions(input) {
    try {
        const encodedInput = encodeURIComponent(input);
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodedInput}&format=json&limit=5`);
        
        if (!response.data) {
            return [];
        }

        return response.data.map(place => ({
            placeId: place.place_id,
            description: place.display_name,
            mainText: place.display_name.split(',')[0],
            secondaryText: place.display_name.split(',').slice(1).join(',').trim()
        }));
    } catch (error) {
        console.error('Error getting suggestions:', error);
        return [];
    }
}

async function getAddressCoordinate(address) {
    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`);
        
        if (!response.data || response.data.length === 0) {
            throw new Error(`No coordinates found for address: ${address}`);
        }

        const location = response.data[0];
        return {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon)
        };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        throw new Error('Failed to get coordinates: ' + error.message);
    }
}

async function getDistanceTime(pickup, destination) {
    try {
        console.log('Getting distance and time for:', { pickup, destination });

        // Get coordinates for pickup and destination
        const pickupCoords = await getAddressCoordinate(pickup);
        const destCoords = await getAddressCoordinate(destination);

        if (!pickupCoords || !destCoords) {
            throw new Error('Could not get coordinates for one or both locations');
        }

        console.log('Coordinates:', { pickupCoords, destCoords });

        // Calculate distance using Haversine formula
        const distance = calculateDistance(
            pickupCoords.lat,
            pickupCoords.lon,
            destCoords.lat,
            destCoords.lon
        );

        // Estimate duration (assuming average speed of 30 km/h)
        const duration = Math.ceil((distance / 30) * 60); // Convert to minutes

        console.log('Calculated:', { distance, duration });

        return {
            distance, // in kilometers
            duration  // in minutes
        };
    } catch (error) {
        console.error('Error in getDistanceTime:', error);
        throw new Error('Failed to calculate distance and time: ' + error.message);
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.ceil(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

const captainModel = require('../models/captain.model');

module.exports = {
    getAutoCompleteSuggestions,
    getAddressCoordinate,
    getDistanceTime,
    getCaptainsInTheRadius: async (ltd, lng, radius) => {
        try {
            return await captainModel.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, ltd], radius / 6371]
                    }
                }
            });
        } catch (error) {
            console.error('Error finding captains:', error);
            return [];
        }
    }
};