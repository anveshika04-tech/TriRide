import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const LocationSearchPanel = ({ onLocationSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchTerm || searchTerm.length < 3) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await API.get(`/maps/get-suggestions?input=${encodeURIComponent(searchTerm)}`);
                setSuggestions(response.data);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
                setError(err.response?.data?.message || 'Failed to fetch suggestions');
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSelect = (suggestion) => {
        setSearchTerm(suggestion.description);
        setSuggestions([]);
        if (onLocationSelect) {
            onLocationSelect(suggestion.description);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter location"
                className="w-full p-2 border rounded"
            />
            
            {loading && (
                <div className="absolute z-10 w-full bg-white border rounded mt-1 p-2">
                    Loading...
                </div>
            )}
            
            {error && (
                <div className="absolute z-10 w-full bg-red-50 text-red-500 border rounded mt-1 p-2">
                    {error}
                </div>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.placeId || index}
                            onClick={() => handleSelect(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearchPanel;