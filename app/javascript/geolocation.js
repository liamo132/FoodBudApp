// Tracks which location mode is active: 'my_location' or 'custom'
let locationMode = 'my_location';

// Store custom location marker on map (defined later when map loads)
let customMarker = null;

// Store custom coordinates when user sets them
let customLat = null;
let customLng = null;

document.addEventListener('turbo:load', function() {
  const searchForm = document.getElementById('searchForm');
  const useMyLocationBtn = document.getElementById('useMyLocation');
  const useCustomLocationBtn = document.getElementById('useCustomLocation');
  const customLocationSearch = document.getElementById('customLocationSearch');
  const locationModeText = document.getElementById('locationModeText');
  const locationModeInput = document.getElementById('locationMode');
  
  // Toggle to "Use My Location" mode
  if (useMyLocationBtn) {
    useMyLocationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Switch to browser geolocation mode
      locationMode = 'my_location';
      locationModeInput.value = 'my_location';
      locationModeText.textContent = 'Use My Location';
      customLocationSearch.style.display = 'none';  // Hide custom input
      
      // Remove custom marker from map if exists
      if (customMarker && window.map) {
        customMarker.setMap(null);
        customMarker = null;
      }
      
      // Clear stored custom coordinates
      customLat = null;
      customLng = null;
    });
  }
  
  // Toggle to "Set Custom Location" mode
  if (useCustomLocationBtn) {
    useCustomLocationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Switch to custom location mode
      locationMode = 'custom';
      locationModeInput.value = 'custom';
      locationModeText.textContent = 'Custom Location';
      customLocationSearch.style.display = 'block';  // Show custom input
      
      // Enable map clicking (if map exists)
      if (window.map) {
        enableMapClick();
      }
    });
  }
  
  // Form submission handler
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();  // Stop normal submission
      
      if (locationMode === 'my_location') {
        // Use browser's geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              // Success - got user's location
              document.getElementById('latitude').value = position.coords.latitude;
              document.getElementById('longitude').value = position.coords.longitude;
              searchForm.submit();
            },
            function(error) {
              // Error or denied - submit without location
              console.log('Geolocation error:', error);
              searchForm.submit();
            }
          );
        } else {
          // Browser doesn't support geolocation
          searchForm.submit();
        }
      } else {
        // Use custom location
        const customLocationInput = document.getElementById('customLocationInput');
        const customLocation = customLocationInput.value;
        
        if (customLat && customLng) {
          // Already have coordinates from map click
          document.getElementById('latitude').value = customLat;
          document.getElementById('longitude').value = customLng;
          searchForm.submit();
        } else if (customLocation) {
          // Need to geocode the address
          geocodeAddress(customLocation, function(lat, lng) {
            if (lat && lng) {
              document.getElementById('latitude').value = lat;
              document.getElementById('longitude').value = lng;
              customLat = lat;
              customLng = lng;
              searchForm.submit();
            } else {
              alert('Could not find that location. Please try again.');
            }
          });
        } else {
          alert('Please enter a location or click on the map.');
        }
      }
    });
  }
});

// Enable clicking on map to set custom location
function enableMapClick() {
  if (window.map) {
    // Add click listener to map
    // User can click anywhere to set their search location
    const clickListener = window.map.addListener('click', function(event) {
      // Get coordinates of clicked point
      customLat = event.latLng.lat();
      customLng = event.latLng.lng();
      
      // Remove old custom marker if exists
      if (customMarker) {
        customMarker.setMap(null);
      }
      
      // Add new blue marker at clicked location
      customMarker = new google.maps.Marker({
        position: { lat: customLat, lng: customLng },
        map: window.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',  // Blue marker
        title: 'Custom Search Location'
      });
      
      // Update input field to show coordinates
      document.getElementById('customLocationInput').value = `${customLat.toFixed(4)}, ${customLng.toFixed(4)}`;
    });
  }
}

// Geocode address using Google Geocoding API
// Converts "Galway, Ireland" into lat/lng coordinates
function geocodeAddress(address, callback) {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ address: address }, function(results, status) {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;
      callback(location.lat(), location.lng());
      
      // Add marker on map at geocoded location
      if (window.map) {
        window.map.setCenter(location);  // Center map on new location
        
        // Remove old marker
        if (customMarker) {
          customMarker.setMap(null);
        }
        
        // Add blue marker
        customMarker = new google.maps.Marker({
          position: location,
          map: window.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          title: 'Custom Search Location'
        });
      }
    } else {
      // Geocoding failed
      callback(null, null);
    }
  });
}