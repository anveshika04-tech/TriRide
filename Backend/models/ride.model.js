const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['solo', 'share'],
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'started', 'completed', 'cancelled'],
        default: 'pending'
    },
    otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', rideSchema);