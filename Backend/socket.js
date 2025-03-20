const socketIO = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: "*", // Allow all origins for testing
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        allowUpgrades: true,
        pingTimeout: 60000,
        pingInterval: 25000,
        cookie: false,
        serveClient: true,
        connectTimeout: 45000
    });

    io.on('connection', (socket) => {
        console.log(`🚀 Client connected: ${socket.id}`);

        // Handle user or captain joining
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;

                if (!userId || !userType) {
                    return socket.emit('error', { message: 'User ID and userType are required' });
                }

                if (userType === 'user') {
                    const user = await userModel.findById(userId);
                    if (!user) return socket.emit('error', { message: 'User not found' });

                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`✅ User (${userId}) joined with socket ID: ${socket.id}`);
                } else if (userType === 'captain') {
                    const captain = await captainModel.findById(userId);
                    if (!captain) return socket.emit('error', { message: 'Captain not found' });

                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`✅ Captain (${userId}) joined with socket ID: ${socket.id}`);
                } else {
                    return socket.emit('error', { message: 'Invalid userType' });
                }
            } catch (error) {
                console.error('❌ Error in join event:', error);
                socket.emit('error', { message: 'Internal server error' });
            }
        });

        // Update Captain's location
        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (!userId || !location || typeof location.ltd !== 'number' || typeof location.lng !== 'number') {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                const captain = await captainModel.findById(userId);
                if (!captain) {
                    return socket.emit('error', { message: 'Captain not found' });
                }

                await captainModel.findByIdAndUpdate(userId, {
                    location: { ltd: location.ltd, lng: location.lng }
                });

                console.log(`📍 Location updated for Captain ${userId}:`, location);
            } catch (error) {
                console.error('❌ Error updating location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // User sends ride request to nearby captains
        socket.on('ride-request', async (data) => {
            const { userId, rideDetails } = data;
            try {
                const onlineCaptains = await captainModel.find({ socketId: { $ne: null } });
                onlineCaptains.forEach(captain => {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'new-ride-request',
                        data: { userId, rideDetails }
                    });
                });
            } catch (err) {
                socket.emit('error', { message: 'Failed to send ride request' });
            }
        });

        // Captain accepts ride
        socket.on('ride-accept', async (data) => {
            const { captainId, userId, rideId } = data;
            
            try {
                const user = await userModel.findById(userId);
                if (user && user.socketId) {
                    sendMessageToSocketId(user.socketId, {
                        event: 'ride-accepted',
                        data: { captainId, rideId }
                    });
                    console.log(`✅ Captain ${captainId} accepted ride ${rideId} for user ${userId}`);
                }
            } catch (err) {
                console.error('❌ Error in ride-accept event:', err);
                socket.emit('error', { message: 'Failed to notify user of acceptance' });
            }
        });

        // User confirms ride
        socket.on('ride-confirm', async (data) => {
            const { userId, captainId, rideId } = data;
            
            try {
                const captain = await captainModel.findById(captainId);
                if (captain && captain.socketId) {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'ride-confirmed',
                        data: { userId, rideId }
                    });
                    console.log(`✅ User ${userId} confirmed ride ${rideId} with captain ${captainId}`);
                }
            } catch (err) {
                console.error('❌ Error in ride-confirm event:', err);
                socket.emit('error', { message: 'Failed to notify captain of confirmation' });
            }
        });

        // Ride status update
        socket.on('ride-status-update', async (data) => {
            const { rideId, userId, captainId, status } = data;

            try {
                const user = await userModel.findById(userId);
                const captain = await captainModel.findById(captainId);

                if (user?.socketId) {
                    sendMessageToSocketId(user.socketId, {
                        event: 'ride-status',
                        data: { rideId, status }
                    });
                }

                if (captain?.socketId) {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'ride-status',
                        data: { rideId, status }
                    });
                }

                console.log(`📦 Ride ${rideId} status updated to "${status}"`);
            } catch (err) {
                console.error('❌ Error in ride-status-update:', err);
                socket.emit('error', { message: 'Failed to update ride status' });
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            try {
                console.log(`⚠️ Client disconnected: ${socket.id}`);

                await userModel.updateMany({ socketId: socket.id }, { socketId: null });
                await captainModel.updateMany({ socketId: socket.id }, { socketId: null });

                console.log(`🗑️ Removed socket ID ${socket.id} from users and captains`);
            } catch (error) {
                console.error('❌ Error handling disconnect:', error);
            }
        });
    });
}

// Function to send messages to a specific socket ID
const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        console.log(`📩 Sending message to ${socketId}:`, messageObject);
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.error('❌ Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };
