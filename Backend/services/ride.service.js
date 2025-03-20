const mapService = require('./maps.service');

const BASE_FARE = {
    solo: 30,
    share: 20
};

const PER_KM_RATE = {
    solo: 15,
    share: 10
};

const MIN_FARE = {
    solo: 30,
    share: 20
};

async function getFare(pickup, destination) {
    try {
        console.log('Calculating fare for:', { pickup, destination });

        // Get coordinates and calculate distance/time
        const { distance, duration } = await mapService.getDistanceTime(pickup, destination);
        console.log('Distance and duration:', { distance, duration });

        // Calculate base fares
        const soloFare = calculateFare(distance, 'solo');
        const shareFare = calculateFare(distance, 'share');

        console.log('Calculated fares:', { soloFare, shareFare });

        return {
            solo: Math.max(soloFare, MIN_FARE.solo),
            share: Math.max(shareFare, MIN_FARE.share),
            distance,
            duration
        };
    } catch (error) {
        console.error('Error in getFare:', error);
        throw new Error('Failed to calculate fare: ' + error.message);
    }
}

function calculateFare(distance, type) {
    if (!['solo', 'share'].includes(type)) {
        throw new Error('Invalid ride type');
    }

    const baseFare = BASE_FARE[type];
    const perKmRate = PER_KM_RATE[type];
    
    // Convert distance to kilometers if it's in meters
    const distanceInKm = distance >= 1000 ? distance / 1000 : distance;
    
    const fare = baseFare + (distanceInKm * perKmRate);
    return Math.ceil(fare); // Round up to nearest rupee
}

async function createRide(userId, pickup, destination, vehicleType) {
    try {
        const fare = await getFare(pickup, destination);
        
        // Create the ride object
        const ride = {
            userId,
            pickup,
            destination,
            vehicleType,
            fare: vehicleType === 'solo' ? fare.solo : fare.share,
            status: 'pending',
            createdAt: new Date()
        };

        console.log('Created ride:', ride);
        return ride;
    } catch (error) {
        console.error('Error in createRide:', error);
        throw new Error('Failed to create ride: ' + error.message);
    }
}

module.exports = {
    getFare,
    createRide
};
