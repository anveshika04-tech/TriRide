import React from 'react';

const ConfirmRide = ({ setConfirmRidePanel, fare, vehicleType, pickup, destination, confirmRide }) => {
  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <div
          className="w-12 h-1 bg-gray-200 rounded-full cursor-pointer"
          onClick={() => setConfirmRidePanel(false)}
        ></div>
      </div>

      <h3 className="text-2xl font-semibold mb-6">Confirm your Ride</h3>

      <div className="space-y-6">
        <div className="flex items-center gap-5 p-3 bg-gray-50 rounded-lg relative">
          <i className="ri-map-pin-user-fill text-xl text-gray-700"></i>
          <div className="w-full">
            <p className="text-sm text-gray-500">Pickup</p>
            <div className="w-full bg-transparent text-gray-800">
              {pickup}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 bg-gray-50 rounded-lg relative">
          <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
          <div className="w-full">
            <p className="text-sm text-gray-500">Destination</p>
            <div className="w-full bg-transparent text-gray-800">
              {destination}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 bg-gray-50 rounded-lg">
          <i className="ri-money-rupee-circle-line text-xl text-gray-700"></i>
          <div>
            <p className="text-sm text-gray-500">Estimated Fare</p>
            <p className="text-gray-800">₹{fare?.[vehicleType] || 'Calculating...'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            console.log('Confirm Ride button clicked');
            confirmRide();
          }}
          className="w-full bg-gray-800 text-white font-medium p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;





