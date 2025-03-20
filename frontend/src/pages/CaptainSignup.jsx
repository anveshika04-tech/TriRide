import React, { useState, useContext } from 'react'
// Fix the router import
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import API from '../api/axiosInstance'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar';

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')


  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()
    try {
        // Validate data before sending
        if (!email || !password || !firstName || !lastName || !vehicleColor || !vehiclePlate || !vehicleCapacity || !vehicleType) {
            alert('Please fill in all fields');
            return;
        }

        const captainData = {
            fullname: {
                firstname: firstName.trim(),
                lastname: lastName.trim()
            },
            email: email.trim().toLowerCase(),
            password: password,
            vehicle: {
                color: vehicleColor.trim(),
                plate: vehiclePlate.trim().toUpperCase(),
                capacity: parseInt(vehicleCapacity) || 0,
                vehicleType: vehicleType.trim()
            }
        }

        console.log('Sending data to:', `/captains/register`);
        console.log('With payload:', captainData);

        // Use API instance instead of axios
        const response = await API.post(
            `/captains/register`, 
            captainData
        );

        console.log('Registration response:', response.data);

        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            setCaptain({
                id: response.data.captain._id,
                email: response.data.captain.email,
                fullname: response.data.captain.fullname,
                vehicle: response.data.captain.vehicle
            });
            
            // Clear form fields on success
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setVehicleColor('');
            setVehiclePlate('');
            setVehicleCapacity('');
            setVehicleType('');
            
            navigate('/captain/home');
        }
    } catch (error) {
        console.error('Registration error details:', error.message);
        
        let errorMessage = 'Registration failed. Please check your details.';
        
        if (error.response) {
            // Server responded with error
            console.error('Server error response:', error.response.data);
            console.error('Status code:', error.response.status);
            
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.request) {
            // No response received
            console.error('No response from server. Check if your backend is running.');
            errorMessage = 'Server not responding. Please try again later or check if the backend service is running.';
        } else {
            // Request setup error
            console.error('Request setup error:', error.message);
            errorMessage = `Error setting up request: ${error.message}`;
        }
        
        alert(errorMessage);
    }
}
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6">Become a TriRide Captain</h2>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Color'
                value={vehicleColor}
                onChange={(e) => {
                  setVehicleColor(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Plate'
                value={vehiclePlate}
                onChange={(e) => {
                  setVehiclePlate(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="number"
                placeholder='Vehicle Capacity'
                value={vehicleCapacity}
                onChange={(e) => {
                  setVehicleCapacity(e.target.value)
                }}
              />
              <select 
                className="w-full p-3 rounded-lg bg-gray-50"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
            >
                <option value="">Select Vehicle Type</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="bike">Bike</option>
            </select>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create Captain Account</button>

          </form>
          {/* Update the link at the bottom of the form */}
          <p className='text-center'>Already have a account? <Link to='/captain/login' className='text-blue-600'>Login here</Link></p>
        </div>
      </div>
      <div>
        <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
          Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default CaptainSignup