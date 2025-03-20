const socketIO = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"]
        },
        path: '/socket.io'
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
