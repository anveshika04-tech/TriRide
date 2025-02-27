import React, { useState, useContext } from 'react'
import API from '../api/axiosInstance'; // ✅ Use API instead of axios
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/users/login', { email, password });
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error
        alert(error.response.data.message || 'Invalid credentials');
      } else if (error.code === 'ERR_NETWORK') {
        // Network error (server not running)
        alert('Cannot connect to server. Please try again later.');
      } else {
        // Other errors
        alert('An error occurred. Please try again.');
      }
      console.error('Login Error:', error);
    }

    setEmail('');
    setPassword('');
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6">Welcome to TriRide</h2>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">What's your email</h3>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-2 w-full text-lg"
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Enter Password</h3>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-2 w-full text-lg"
                type="password"
                placeholder="password"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg text-lg hover:bg-yellow-500 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6">
            New here? <Link to="/signup" className="text-yellow-500 hover:text-yellow-600">Create new Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin;
