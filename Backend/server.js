require("dotenv").config({ path: "./.env" });  // Explicitly load .env

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

let port = process.env.PORT || 5001;
const server = http.createServer(app);

// Handle server errors
function startServer() {
    server.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
            port++;
            startServer();
        } else {
            console.error('❌ Server error:', err);
        }
    });
}

initializeSocket(server);
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
