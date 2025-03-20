import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import API from '../api/axiosInstance' // Replace direct axios import with your API instance
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
});

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMap()

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        })
    }, [map])

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [isOnline, setIsOnline] = useState(false)
    const [earnings, setEarnings] = useState(0)
    const [tripsCompleted, setTripsCompleted] = useState(0)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)
    const defaultPosition = [23.2599, 77.4126]

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (socket && captain && captain._id) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            })
            
            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                ltd: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        })
                    })
                }
            }

            const locationInterval = setInterval(updateLocation, 10000)
            updateLocation()

            return () => clearInterval(locationInterval)
        }
    }, [socket, captain])

    useEffect(() => {
        if (socket) {
            // Listen for new ride requests
            socket.on('new-ride', (rideData) => {
                console.log('New ride request received:', rideData);
                setRide(rideData);
                setRidePopupPanel(true);
            });

            // Listen for ride confirmation from user
            socket.on('ride-confirmed', (data) => {
                console.log('Ride confirmed by user:', data);
                setRidePopupPanel(false);
                // Navigate to riding page or update UI accordingly
            });

            return () => {
                socket.off('new-ride');
                socket.off('ride-confirmed');
            };
        }
    }, [socket]);

    // Fetch captain's earnings and trips data
    useEffect(() => {
        if (captain && captain._id) {
            const fetchEarningsData = async () => {
                try {
                    // Remove the base URL prefix since it's already in the API instance
                    const response = await API.get(`/captains/earnings/${captain._id}`);
                    
                    if (response.data) {
                        setEarnings(response.data.totalEarnings || 0);
                        setTripsCompleted(response.data.tripsCompleted || 0);
                    }
                } catch (error) {
                    console.error('Error fetching earnings data:', error);
                    // Set default values in case of error
                    setEarnings(0);
                    setTripsCompleted(0);
                }
            };
            
            fetchEarningsData();
        }
    }, [captain]);

    const handleAcceptRide = async () => {
        try {
            if (!ride || !captain) return;

            // Confirm the ride through the API
            const response = await API.post('/rides/confirm', {
                rideId: ride._id
            });

            if (response.data) {
                // Notify the user that the ride has been accepted
                socket.emit('ride-accept', {
                    captainId: captain._id,
                    userId: ride.userId,
                    rideId: ride._id,
                    captain: {
                        _id: captain._id,
                        fullname: captain.fullname,
                        vehicle: captain.vehicle
                    }
                });

                setRidePopupPanel(false);
                // Navigate to riding page or update UI accordingly
            }
        } catch (error) {
            console.error('Error accepting ride:', error);
            alert('Failed to accept ride. Please try again.');
        }
    };

    const handleRejectRide = () => {
        setRidePopupPanel(false);
        setRide(null);
    };

    const handleToggleOnline = async () => {
        try {
            const newStatus = !isOnline;
            setIsOnline(newStatus);
            
            // For testing/development - proceed even if API fails
            try {
                // Use API instance instead of axios
                await API.post(`/captains/update-status`, {
                    isOnline: newStatus
                });
                
                console.log('Captain status updated successfully');
            } catch (error) {
                console.error('API Error updating online status:', error);
                // Continue anyway for development purposes
            }
            
            // Emit status change to socket
            if (socket) {
                socket.emit('captain-status-change', {
                    captainId: captain._id,
                    isOnline: newStatus
                });
                console.log('Socket status change emitted');
            }
        } catch (error) {
            console.error('Error updating online status:', error);
            // Don't revert UI during development
        }
    };

    // Simulate ride request function for testing
    const simulateRideRequest = () => {
        const mockRide = {
            _id: 'ride_' + Math.random().toString(36).substr(2, 9),
            user: {
                fullname: 'Test User',
                profilePic: 'https://via.placeholder.com/40'
            },
            distance: '2.2 KM',
            pickup: '582/11-A, Kankaria Talab, Bhopal',
            destination: 'Arera Colony, Bhopal',
            fare: 193.20
        };
        setRide(mockRide);
        setRidePopupPanel(true);
    };

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen relative'>
            {/* Map Container */}
            <MapContainer 
                center={defaultPosition} 
                zoom={13} 
                style={{ height: "60vh", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
            </MapContainer>

            {/* Header */}
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-[1000]'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain/login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* Captain Info Panel */}
            <div className='h-2/5 p-6'>
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h2 className="text-xl font-semibold">Welcome, {captain?.fullname?.firstname}</h2>
                    <p className="text-gray-600">Vehicle: {captain?.vehicle?.color} {captain?.vehicle?.vehicleType}</p>
                    <p className="text-gray-600">Plate: {captain?.vehicle?.plate}</p>
                    
                    {/* Online/Offline Toggle */}
                    <div className="mt-4">
                        <button 
                            onClick={handleToggleOnline}
                            className={`w-full py-2 rounded-lg ${isOnline ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                    
                    {/* Today's Earnings */}
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-medium">Today's Earnings</h3>
                        <p className="text-2xl font-bold">₹{earnings.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{tripsCompleted} trips completed</p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-medium mb-2">Quick Actions</h3>
                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg mb-2">
                            View History
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg mb-2">
                            Support
                        </button>
                        <button 
                            onClick={simulateRideRequest}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Test Ride Request
                        </button>
                    </div>
                </div>
            </div>

            {/* Ride Popup Panels */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={handleAcceptRide}
                    rejectRide={handleRejectRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                    setRidePopupPanel={setRidePopupPanel} 
                />
            </div>
        </div>
    )
}

export default CaptainHome
