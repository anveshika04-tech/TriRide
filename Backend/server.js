require("dotenv").config();

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 5001;
const server = http.createServer(app);

// Initialize Socket.IO with CORS
initializeSocket(server);

server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
