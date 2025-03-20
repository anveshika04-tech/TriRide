import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const center = {
    lat: 23.2599,
    lng: 77.4126
}

const Map = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >
        </GoogleMap>
    )
}

export default Map
