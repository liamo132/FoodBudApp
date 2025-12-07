import { useState, useEffect, useRef } from 'react';

function Navbar({ onSearch, onAddClick }) {
  const [keyword, setKeyword] = useState('');
  const [radius, setRadius] = useState('25');
  const [locationMode, setLocationMode] = useState('my_location');
  const [customLocation, setCustomLocation] = useState('');
  const customMarkerRef = useRef(null);
  const clickListenerRef = useRef(null);
  const customLatRef = useRef(null);
  const customLngRef = useRef(null);

  // Enable/disable map clicking based on location mode
  useEffect(() => {
    if (!window.map) return;

    // Remove old click listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    if (locationMode === 'custom') {
      // Enable map clicking
      enableMapClick();
    } else {
      // Remove custom marker when switching back to "Use My Location"
      if (customMarkerRef.current) {
        customMarkerRef.current.setMap(null);
        customMarkerRef.current = null;
      }
      customLatRef.current = null;
      customLngRef.current = null;
    }

    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
      }
    };
  }, [locationMode]);

  const enableMapClick = () => {
    if (!window.map) return;

    // Add RIGHT-CLICK listener to map
    clickListenerRef.current = window.map.addListener('rightclick', async function(event) {
      event.stop(); // Prevent context menu
      
      // Get coordinates of clicked point
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      customLatRef.current = lat;
      customLngRef.current = lng;
      
      // Remove old custom marker if exists
      if (customMarkerRef.current) {
        customMarkerRef.current.setMap(null);
      }
      
      // Create blue marker using AdvancedMarkerElement
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
      
      const bluePinElement = new PinElement({
        background: '#4285F4',
        borderColor: '#ffffff',
        glyphColor: '#ffffff'
      });
      
      customMarkerRef.current = new AdvancedMarkerElement({
        map: window.map,
        position: { lat, lng },
        content: bluePinElement.element,
        title: 'Custom Search Location (Right-click to move)'
      });
      
      // Update input field to show coordinates
      setCustomLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });
  };

  const geocodeAddress = (address, callback) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, async function(results, status) {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        callback(lat, lng);
        
        // Add marker on map at geocoded location
        if (window.map) {
          window.map.setCenter(location);
          
          // Remove old marker
          if (customMarkerRef.current) {
            customMarkerRef.current.setMap(null);
          }
          
          // Create blue marker
          const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
          
          const bluePinElement = new PinElement({
            background: '#4285F4',
            borderColor: '#ffffff',
            glyphColor: '#ffffff'
          });
          
          customMarkerRef.current = new AdvancedMarkerElement({
            map: window.map,
            position: location,
            content: bluePinElement.element,
            title: 'Custom Search Location'
          });
        }
      } else {
        callback(null, null);
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (locationMode === 'my_location') {
      // Use browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onSearch({
              keyword,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              radius,
              locationMode: 'my_location'
            });
          },
          (error) => {
            console.log('Geolocation error:', error);
            alert('Could not get your location. Please enable location services or use custom location.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    } else {
      // Use custom location
      if (customLatRef.current && customLngRef.current) {
        // Already have coordinates from map click
        onSearch({
          keyword,
          latitude: customLatRef.current,
          longitude: customLngRef.current,
          radius,
          locationMode: 'custom',
          customLocation
        });
      } else if (customLocation) {
        // Need to geocode the address
        geocodeAddress(customLocation, (lat, lng) => {
          if (lat && lng) {
            customLatRef.current = lat;
            customLngRef.current = lng;
            onSearch({
              keyword,
              latitude: lat,
              longitude: lng,
              radius,
              locationMode: 'custom',
              customLocation
            });
          } else {
            alert('Could not find that location. Please try again or right-click on the map.');
          }
        });
      } else {
        alert('Please enter a location or right-click on the map to set a custom search location.');
      }
    }
  };

  return (
    <div className="search-container">
      <div className="container">
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-end">
              {/* Location Toggle */}
              <div className="col-md-3">
                <label className="form-label fw-bold">Location</label>
                <div className="dropdown w-100">
                  <button
                    className="btn dropdown-toggle w-100 text-start"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    📍 {locationMode === 'my_location' ? 'Use My Location' : 'Custom Location'}
                  </button>
                  <ul className="dropdown-menu w-100">
                    <li>
  <a
    className="dropdown-item"
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setLocationMode('my_location');
      setCustomLocation('');
    }}
  >
    Use My Location
  </a>
</li>

<li>
  <a
    className="dropdown-item"
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setLocationMode('custom');
    }}
  >
    Set Custom Location
  </a>
</li>

                  </ul>
                </div>

                {/* Custom Location Input */}
                {locationMode === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Galway, Ireland"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                    />
                    <small className="text-muted d-block mt-1">Or right-click on the map</small>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="col-md-5">
                <label className="form-label fw-bold">Search Restaurants</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., pizza, sushi, burgers"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              {/* Distance Dropdown */}
              <div className="col-md-2">
                <label className="form-label fw-bold">Distance</label>
                <select
                  className="form-select"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                >
                  <option value="10">10 km</option>
                  <option value="15">15 km</option>
                  <option value="25">25 km</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary-tomato w-100">
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Add Restaurant Button */}
          <div className="row mt-3">
            <div className="col-12 text-center">
              <button className="btn btn-outline-tomato" onClick={onAddClick}>
                Add Your Own Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;