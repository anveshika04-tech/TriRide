import React from 'react';

const VehiclePanel = ({ selectVehicle, fare, setVehiclePanel }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Select Ride Type</h2>
                <button 
                    onClick={() => setVehiclePanel(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-4">
                <div 
                    onClick={() => selectVehicle('solo')}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                >
                    <div>
                        <h3 className="font-semibold">Solo Ride</h3>
                        <p className="text-gray-600">Private ride just for you</p>
                    </div>
                    <div className="text-xl font-bold">₹{fare?.solo}</div>
                </div>

                <div 
                    onClick={() => selectVehicle('share')}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                >
                    <div>
                        <h3 className="font-semibold">Shared Ride</h3>
                        <p className="text-gray-600">Share your ride and save money</p>
                    </div>
                    <div className="text-xl font-bold">₹{fare?.share}</div>
                </div>
            </div>
        </div>
    );
};

export default VehiclePanel;