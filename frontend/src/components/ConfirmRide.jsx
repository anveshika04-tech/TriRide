import React from 'react'

const ConfirmRide = ({ setConfirmRidePanel, setVehicleFound, createRide, pickup, destination, fare, vehicleType }) => {
    return (
        <div className="p-6">
            <div className="flex justify-center mb-6">
                <div 
                    className="w-12 h-1 bg-gray-200 rounded-full cursor-pointer"
                    onClick={() => setConfirmRidePanel(false)}
                ></div>
            </div>

            <h3 className='text-2xl font-semibold mb-6'>Confirm your Ride</h3>

            <div className='space-y-6'>
                <div className='flex items-center gap-5 p-3 bg-gray-50 rounded-lg'>
                    <i className="ri-map-pin-user-fill text-xl text-gray-700"></i>
                    <div>
                        <p className='text-sm text-gray-500'>Pickup</p>
                        <p className='text-gray-800'>{pickup}</p>
                    </div>
                </div>

                <div className='flex items-center gap-5 p-3 bg-gray-50 rounded-lg'>
                    <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
                    <div>
                        <p className='text-sm text-gray-500'>Destination</p>
                        <p className='text-gray-800'>{destination}</p>
                    </div>
                </div>

                <div className='flex items-center gap-5 p-3 bg-gray-50 rounded-lg'>
                    <i className="ri-money-rupee-circle-line text-xl text-gray-700"></i>
                    <div>
                        <p className='text-sm text-gray-500'>Estimated Fare</p>
                        <p className='text-gray-800'>₹{fare?.[vehicleType] || 'Calculating...'}</p>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        setVehicleFound(true)
                        setConfirmRidePanel(false)
                        createRide()
                    }} 
                    className='w-full bg-gray-800 text-white font-medium p-3 rounded-lg hover:bg-gray-700 transition-colors'
                >
                    Confirm Ride
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide