import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axiosInstance' // Replace axios with API instance
import { CaptainDataContext } from '../context/CapatainContext'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // Add error state

  const { setCaptain } = useContext(CaptainDataContext) // Fix context usage
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setError(''); // Clear previous errors
      
      // Validate input
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        return;
      }
      
      const captainCredentials = {
        email: email.trim(),
        password: password.trim()
      }

      // Use API instance and correct endpoint
      const response = await API.post(`/captains/login`, captainCredentials)

      if (response.data?.token && response.data?.captain) {
        const { token, captain } = response.data;
        
        // Store token and captain data
        localStorage.setItem('token', token);
        localStorage.setItem('captain', JSON.stringify(captain));
        
        // Update context
        setCaptain(captain);
        
        // Navigate to captain home
        navigate('/captain/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password');
            break;
          case 404:
            setError('Captain not found');
            break;
          case 422:
            setError('Please provide both email and password');
            break;
          default:
            setError(error.response.data?.message || 'Login failed');
        }
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Clear sensitive data
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6">Captain Login</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          <form onSubmit={submitHandler}>
            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type="password"
              placeholder='password'
            />

            <button
              type="submit"
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Login</button>
          </form>
          {/* Update the link at the bottom of the form */}
          <p className='text-center'>Join a fleet? <Link to='/captain/signup' className='text-blue-600'>Register as a Captain</Link></p>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin