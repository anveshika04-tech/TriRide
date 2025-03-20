import { useState, useContext } from 'react'
import API from '../api/axiosInstance'; // ✅ Use API instead of axios
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // Add error state
  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError(''); // Clear any previous errors
      
      // Validate input
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        return;
      }

      // Try the auth endpoint first
      let response;
      try {
        response = await API.post('/auth/login', { email: email.trim(), password: password.trim() });
      } catch (authError) {
        // If auth endpoint fails, try the users endpoint
        console.log('Auth endpoint failed, trying users endpoint');
        response = await API.post('/users/login', { email: email.trim(), password: password.trim() });
      }
      
      if (response.data?.token && response.data?.user) {
        const { token, user } = response.data;
        
        // Store the token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update context
        setUser(user);
        
        // Redirect to home page
        navigate('/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login Error:', error);
      
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password');
            break;
          case 404:
            setError('User not found');
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6">Welcome to TriRide</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
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
