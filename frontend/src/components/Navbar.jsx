import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isCaptainLoginPage = location.pathname === '/captain-login';
  const isCaptainSignupPage = location.pathname === '/captain-signup';

  return (
    <nav className="bg-white shadow-md px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {!isLoginPage && (
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-yellow-500 transition-colors"
          >
            Login
          </Link>
        )}
        {!isSignupPage && (
          <Link 
            to="/signup" 
            className="text-gray-700 hover:text-yellow-500 transition-colors"
          >
            Sign Up
          </Link>
        )}
        {!isCaptainLoginPage && !isCaptainSignupPage && (
          <Link 
            to="/captain/login" 
            className="bg-yellow-400 text-black px-3 py-1.5 text-sm rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Sign in as Captain
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 