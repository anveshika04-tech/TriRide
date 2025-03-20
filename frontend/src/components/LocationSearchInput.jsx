import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const LocationSearchInput = ({ value, onChange, placeholder }) => {
  return (
    <PlacesAutocomplete
      value={value}
      onChange={onChange}
      searchOptions={{ componentRestrictions: { country: 'in' } }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="w-full">
          <input
            {...getInputProps({
              placeholder,
              className: 'w-full bg-transparent focus:outline-none text-gray-800',
            })}
          />
          <div className="absolute z-50 w-full bg-white shadow-lg">
            {loading && <div className="p-2">Loading...</div>}
            {suggestions.map(suggestion => (
              <div
                {...getSuggestionItemProps(suggestion, {
                  className: 'p-2 hover:bg-gray-100 cursor-pointer',
                })}
                key={suggestion.placeId}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;