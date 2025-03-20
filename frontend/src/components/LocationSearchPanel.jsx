import React from 'react';

const LocationSearchPanel = ({ 
    suggestions,
    setPanelOpen,
    setVehiclePanel,
    setPickup,
    setDestination,
    activeField
}) => {
    const handleSelect = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.description);
        } else if (activeField === 'destination') {
            setDestination(suggestion.description);
        }
        setPanelOpen(false);
    };

    return (
        <div className="bg-white h-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Select {activeField === 'pickup' ? 'Pickup' : 'Destination'} Location
                </h2>
                <button 
                    onClick={() => setPanelOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>
            </div>

            {suggestions && suggestions.length > 0 ? (
                <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.placeId}
                            onClick={() => handleSelect(suggestion)}
                            className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-center"
                        >
                            <i className="ri-map-pin-line text-xl text-gray-600 mr-3"></i>
                            <div>
                                <p className="text-gray-800">{suggestion.description}</p>
                                {suggestion.coordinates && (
                                    <p className="text-sm text-gray-500">
                                        {suggestion.coordinates.lat.toFixed(4)}, {suggestion.coordinates.lng.toFixed(4)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    Start typing to see location suggestions
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;