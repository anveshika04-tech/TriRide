# Deployment Guide

## Backend Deployment (Example with Railway)

1. Create a Railway account
2. Create a new project
3. Add MongoDB plugin
4. Configure environment variables
5. Deploy from GitHub

## Frontend Deployment (Example with Vercel)

1. Create a Vercel account
2. Import project from GitHub
3. Configure environment variables
4. Deploy

## Environment Variables

### Backend
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (usually set by platform)
- `JWT_SECRET`: Secret key for JWT
- `GOOGLE_MAPS_API`: Google Maps API key

### Frontend
- `VITE_BASE_URL`: Backend API URL
- `VITE_SOCKET_URL`: WebSocket server URL
- `VITE_GOOGLE_MAPS_API`: Google Maps API key 