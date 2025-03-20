import React, { useState, useEffect } from 'react'
import Map from '../components/Map'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import axios from 'axios'
import { gsap } from 'gsap'
import '../styles/Home.css'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [lookingForDriver, setLookingForDriver] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [ride, setRide] = useState(null)
    const [vehicleType, setVehicleType] = useState(null)
    const [fare, setFare] = useState(null)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [showWelcome, setShowWelcome] = useState(true)

    useEffect(() => {
        if (vehiclePanel) {
            gsap.to(".vehicle-panel", {
                x: 0,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    }, [vehiclePanel])

    useEffect(() => {
        if (confirmRidePanel) {
            gsap.to(".confirm-ride-panel", {
                x: 0,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    }, [confirmRidePanel])

    useEffect(() => {
        if (lookingForDriver) {
            gsap.to(".looking-for-driver", {
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    }, [lookingForDriver])

    useEffect(() => {
        if (waitingForDriver) {
            gsap.to(".waiting-for-driver", {
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    }, [waitingForDriver])

    const handlePickupChange = async (e) => {
        const value = e.target.value;
        setPickup(value);
        
        if (value.length > 2) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Pickup suggestions:', response.data);
                setPickupSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching pickup suggestions:', error);
                setPickupSuggestions([]);
            }
        } else {
            setPickupSuggestions([]);
        }
    };

    const handleDestinationChange = async (e) => {
        const value = e.target.value;
        setDestination(value);
        
        if (value.length > 2) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Destination suggestions:', response.data);
                setDestinationSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching destination suggestions:', error);
                setDestinationSuggestions([]);
            }
        } else {
            setDestinationSuggestions([]);
        }
    };

    const handleSuggestionSelect = (suggestion, type) => {
        if (type === 'pickup') {
            setPickup(suggestion.description);
            setPickupSuggestions([]);
        } else {
            setDestination(suggestion.description);
            setDestinationSuggestions([]);
        }
    };

    async function findTrip() {
        try {
            if (!pickup || !destination) {
                alert('Please enter pickup and destination locations');
                return;
            }

            console.log('Finding trip with:', { pickup, destination });
            
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Fare response:', response.data);
            setFare(response.data);
            setVehiclePanel(true);
        } catch (error) {
            console.error('Error finding trip:', error.response?.data || error.message);
            alert('Unable to calculate fare. Please try again.');
            setVehiclePanel(false);
            setFare(null);
        }
    }

    async function selectVehicle(type) {
        try {
            setVehicleType(type);
            setVehiclePanel(false);
            setConfirmRidePanel(true);
        } catch (error) {
            console.error('Error selecting vehicle:', error);
            alert('Unable to select vehicle. Please try again.');
        }
    }

    async function confirmRide() {
        try {
            setConfirmRidePanel(false);
            setLookingForDriver(true);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Ride created:', response.data);
            setRide(response.data);
            setLookingForDriver(false);
            setWaitingForDriver(true);
        } catch (error) {
            console.error('Error creating ride:', error.response?.data || error.message);
            setLookingForDriver(false);
            alert('Unable to create ride. Please try again.');
        }
    }

    return (
        <>
            {showWelcome ? (
                <div className="home-container">
                    <div className="auto-image-container">
                        <img src="/auto.png" alt="TriRide Auto" className="auto-image" />
                    </div>
                    <div className="content-section">
                        <h1 className="title">Get Started with TriRide</h1>
                        <p className="subtitle">Book a ride and reach your destination with ease.</p>
                        <button 
                            className="cta-button"
                            onClick={() => setShowWelcome(false)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            ) : (
                <div className='relative'>
                    <Map />

                    <div className="absolute top-8 w-full px-4">
                        <div className="mx-auto max-w-lg bg-white rounded-lg shadow-lg p-6">
                            <h1 className='text-3xl font-bold mb-6'>Book a Ride</h1>
                            <p className='text-gray-600 mb-8'>Book a ride and reach your destination with comfort and safety</p>

                            <div className='space-y-4'>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder='Enter pickup location'
                                        className='w-full p-3 border rounded-lg'
                                        value={pickup}
                                        onChange={handlePickupChange}
                                    />
                                    {pickupSuggestions.length > 0 && (
                                        <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border z-50">
                                            {pickupSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.placeId}
                                                    onClick={() => handleSuggestionSelect(suggestion, 'pickup')}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {suggestion.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder='Enter destination'
                                        className='w-full p-3 border rounded-lg'
                                        value={destination}
                                        onChange={handleDestinationChange}
                                    />
                                    {destinationSuggestions.length > 0 && (
                                        <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border z-50">
                                            {destinationSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.placeId}
                                                    onClick={() => handleSuggestionSelect(suggestion, 'destination')}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {suggestion.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={findTrip}
                                    className='w-full bg-[#2B2D42] text-white p-3 rounded-lg font-semibold hover:bg-[#1A1B2B] transition-colors'
                                >
                                    Find Trip
                                </button>
                            </div>
                        </div>
                    </div>

                    {vehiclePanel && (
                        <div className="vehicle-panel fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform translate-x-full p-6 overflow-y-auto">
                            <VehiclePanel
                                selectVehicle={selectVehicle}
                                fare={fare}
                                setConfirmRidePanel={setConfirmRidePanel}
                                setVehiclePanel={setVehiclePanel}
                            />
                        </div>
                    )}

                    {confirmRidePanel && (
                        <div className="confirm-ride-panel fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform translate-x-full p-6">
                            <ConfirmRide
                                fare={fare}
                                vehicleType={vehicleType}
                                confirmRide={confirmRide}
                                setConfirmRidePanel={setConfirmRidePanel}
                            />
                        </div>
                    )}

                    {lookingForDriver && (
                        <div className="looking-for-driver fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transform scale-0">
                            <LookingForDriver />
                        </div>
                    )}

                    {waitingForDriver && (
                        <div className="waiting-for-driver fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transform scale-0">
                            <WaitingForDriver ride={ride} />
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Home