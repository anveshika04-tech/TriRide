# TriRide Application

A full-stack ride-sharing application built with React, Node.js, Socket.IO, and Google Maps API.

## Features

- Real-time location tracking
- User authentication
- Location search with Google Maps API
- Ride booking and management
- Real-time driver matching
- Distance and fare calculation

## Tech Stack

### Frontend
- React
- Socket.IO Client
- Axios
- Google Maps API
- TailwindCSS

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Maps API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/uber-clone.git
cd uber-clone
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Copy the example environment files and update them with your values:

Backend:
```bash
cp Backend/.env.example Backend/.env
```

Frontend:
```bash
cp frontend/.env.example frontend/.env
```

Backend (.env):
```env
MONGO_URI=mongodb://localhost:27017/uber-video
PORT=5001
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
```

Frontend (.env):
```env
VITE_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_MAPS_API=your_google_maps_api_key
```

5. Start the servers

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 