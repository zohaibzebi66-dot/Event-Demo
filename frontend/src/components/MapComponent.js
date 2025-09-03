import React from "react";

const MapComponent = ({ latitude, longitude, title, venue }) => {
  // For demo purposes, we'll use a simple Google Maps embed
  // In production, you'd want to use Google Maps API or Mapbox with proper API keys
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}&zoom=15`;

  // Fallback static map for demo
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Location</h3>
      <div className="mb-3">
        <p className="text-gray-700 font-medium">{venue}</p>
        <p className="text-gray-500 text-sm">
          Coordinates: {latitude}, {longitude}
        </p>
      </div>

      {/* Demo Map Placeholder */}
      <div className="relative bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">Interactive Map</p>
          <p className="text-xs">{venue}</p>
          <p className="text-xs text-gray-400">
            Lat: {latitude}, Lng: {longitude}
          </p>
        </div>
      </div>

      <div className="mt-3 flex space-x-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-primary-700 transition-colors"
        >
          Open in Google Maps
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-gray-700 transition-colors"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default MapComponent;
