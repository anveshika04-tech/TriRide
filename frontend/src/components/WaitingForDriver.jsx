import React, { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'

const WaitingForDriver = (props) => {
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (socket) {
      // Listen for ride status updates
      socket.on('ride-status', (data) => {
        console.log('Ride status update:', data);
        if (data.status === 'started') {
          // Navigate to riding page when ride starts
          navigate('/riding', { state: { ride: props.ride } });
        }
      });

      return () => {
        socket.off('ride-status');
      };
    }
  }, [socket, navigate, props.ride]);

  // Check if ride exists before rendering captain details
  const hasCaptain = props.ride && props.ride.captain;
  
  // Safely access vehicle details
  const vehicleInfo = hasCaptain && props.ride.captain.vehicle ? 
    `${props.ride.captain.vehicle.color} ${props.ride.captain.vehicle.vehicleType}` : 
    'Vehicle info loading...';
  
  // Safely access captain name
  const captainName = hasCaptain && props.ride.captain.fullname ? 
    props.ride.captain.fullname.firstname : 
    'Driver';

  return (
    <div className="waiting-for-driver fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] scale-0 origin-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h5 className='p-1 text-center w-full' onClick={() => {
          props.setWaitingForDriver(false)
        }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>

        {hasCaptain ? (
          // Show captain details if available
          <div className='flex items-center justify-between'>
            <img className='h-12 w-12 object-cover rounded-full' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Driver" />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{captainName}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{hasCaptain && props.ride.captain.vehicle ? props.ride.captain.vehicle.plate : 'Loading...'}</h4>
              <p className='text-sm text-gray-600'>{vehicleInfo}</p>
              <h1 className='text-lg font-semibold'>{props.ride?.otp || 'Loading...'}</h1>
            </div>
          </div>
        ) : (
          // Show waiting message if no captain assigned yet
          <div className='text-center py-4'>
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
              <h2 className='text-xl font-medium mb-2'>Waiting for driver...</h2>
              <p className='text-gray-600'>We're connecting you with a nearby driver</p>
            </div>
          </div>
        )}

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-user-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Pickup</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup || 'Loading...'}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Destination</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination || 'Loading...'}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹{props.ride?.fare || '0'}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver