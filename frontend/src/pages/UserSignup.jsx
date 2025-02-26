import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance'; // ✅ Use API instance
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password
    };

    try {
      const response = await API.post('/users/register', newUser);

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user); // ✅ Updating global user context
        localStorage.setItem('token', data.token); // ✅ Store token for authentication
        navigate('/home');
      }
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
      alert('Signup failed, please try again');
    }

    // Reset form fields
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Logo" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg w-1/2 font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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
            required
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='password'
          />

          <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
            Create account
          </button>
        </form>

        <p className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
      </div>
      
      <div>
        <p className='text-[10px] leading-tight'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
