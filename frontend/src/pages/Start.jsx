import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import autoImage from '../assets/auto.png';  // Import the image
import Navbar from '../components/Navbar';

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side - Three-Wheeler Image */}
        <div className="w-1/2 bg-yellow-50 flex items-center justify-center">
          <img 
            src={autoImage} 
            alt="TriRide Auto" 
            className="w-4/5 h-auto object-contain"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12">
          {/* Content Box */}
          <div className="bg-gray-100 p-10 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-4xl font-semibold mb-6">Get Started with TriRide</h2>
            <p className="text-gray-600 mb-6">Book a ride and reach your destination with ease.</p>
            <Link 
              to='/login' 
              className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black text-center py-4 rounded-lg font-medium transition-colors"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
