import React from 'react'
import autoLogo from '../assets/single.png'
import shareAutoLogo from '../assets/share.png'

const VehiclePanel = ({ selectVehicle, fare, setConfirmRidePanel, setVehiclePanel }) => {
    console.log('VehiclePanel received fare:', fare);

    const handleVehicleSelect = (type) => {
        console.log('Selected vehicle type:', type);
        selectVehicle(type);
        setVehiclePanel(false);
        setConfirmRidePanel(true);
    }

    if (!fare || (!fare.solo && !fare.share)) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-600">Loading fare details...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className='text-2xl font-semibold mb-6'>Choose a Vehicle</h2>
            
            {/* TriRide Solo Option */}
            <div 
                onClick={() => handleVehicleSelect('solo')}
                className='flex items-center justify-between p-4 border rounded-lg mb-4 cursor-pointer hover:bg-gray-50 transition-colors'
            >
                <div className='flex items-center gap-4'>
                    <img 
                        src={autoLogo}
                        alt="Solo Auto" 
                        className='w-16 h-16 object-contain'
                    />
                    <div>
                        <h3 className='font-semibold'>TriRide Solo</h3>
                        <p className='text-sm text-gray-600'>Private ride, just for you</p>
                        <p className='text-sm text-gray-500'>2 mins away</p>
                    </div>
                </div>
                <div className='text-lg font-semibold'>
                    ₹{fare.solo}
                </div>
            </div>

            {/* TriRide Share Option */}
            <div 
                onClick={() => handleVehicleSelect('share')}
                className='flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
            >
                <div className='flex items-center gap-4'>
                    <img 
                        src={shareAutoLogo}
                        alt="Share Auto" 
                        className='w-16 h-16 object-contain'
                    />
                    <div>
                        <h3 className='font-semibold'>TriRide Share</h3>
                        <p className='text-sm text-gray-600'>Share your ride, save money</p>
                        <p className='text-sm text-gray-500'>3 mins away</p>
                    </div>
                </div>
                <div className='text-lg font-semibold'>
                    ₹{fare.share}
                </div>
            </div>
        </div>
    )
}

export default VehiclePanel