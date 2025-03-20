import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import autoImage from '../assets/auto.png';
import { gsap } from 'gsap';

/**
 * The Start component is the landing page for the TriRide application. It features
 * a smooth animation on load for both the auto image and the content section. The
 * page includes a navigation bar and provides a link for users to get started.
 * The layout is divided into two sections: a promotional text section and an image
 * section showcasing an auto-rickshaw.
 */
const Start = () => {
  useEffect(() => {
    gsap.from('.auto-animation', {
      opacity: 0.8,
      x: -50,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.content-animation', {
      opacity: 0.9,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex flex-1 p-12">
        <div className="w-1/2 flex flex-col justify-center items-start content-animation">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            Go anywhere with <span className='text-yellow-500'>TriRide</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            Your reliable auto-rickshaw booking platform
          </p>
          <Link 
            to="/login" 
            className="px-10 py-4 text-lg font-semibold rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>

        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="relative auto-animation">
            <img 
              src={autoImage} 
              alt="TriRide Auto" 
              className="w-3/4 h-auto object-contain relative z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
