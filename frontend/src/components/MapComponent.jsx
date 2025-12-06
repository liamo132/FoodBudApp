import { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

function MapComponent({ restaurants, searchParams, mapsApiKey, onGooglePlacesUpdate, onSaveGooglePlace }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [restaurantMarkers, setRestaurantMarkers] = useState([]);
  const [googlePlacesMarkers, setGooglePlacesMarkers] = useState([]);
  const [customMarker, setCustomMarker] = useState(null);
  const infoWindowRef = useRef(null);
  const clickListenerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const newMap = new google.maps.Map(mapRef.current, {
      center: { lat: 53.3498, lng: -6.2603 },
      zoom: 12,
      mapId: 'FOODBUD_MAP_ID'
    });

    setMap(newMap);
    infoWindowRef.current = new google.maps.InfoWindow();
    window.map = newMap;
  }, []);

  // ALWAYS show restaurant markers (red and green) - never clear these
  useEffect(() => {
    if (!map) return;

    const updateRestaurantMarkers = async () => {
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

      // Clear only restaurant markers
      restaurantMarkers.forEach(marker => marker.map = null);

      // Create markers for ALL restaurants (always visible)
      const newMarkers = restaurants.map(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return null;

        const pinColor = restaurant.user_added ? '#4CAF50' : '#FF6347';
        const pinElement = new PinElement({
          background: pinColor,
          borderColor: '#ffffff',
          glyphColor: '#ffffff'
        });

        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: restaurant.latitude, lng: restaurant.longitude },
          title: restaurant.name,
          content: pinElement.element
        });

        marker.addListener('click', () => {
          infoWindowRef.current.setContent(`
            <div style="padding: 10px; max-width: 250px;">
              <h5>${restaurant.name}</h5>
              <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
              <p><strong>Address:</strong> ${restaurant.address}</p>
              ${restaurant.website ? `<a href="${restaurant.website}" target="_blank">Visit Website</a><br>` : ''}
              <span class="badge bg-${restaurant.user_added ? 'success' : 'primary'}">
                ${restaurant.user_added ? 'User Added' : 'Saved'}
              </span>
            </div>
          `);
          infoWindowRef.current.open({ anchor: marker, map });
        });

        return marker;
      }).filter(Boolean);

      setRestaurantMarkers(newMarkers);

      // Only auto-fit if there's NO search active
      if (!searchParams.keyword && newMarkers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          bounds.extend(marker.position);
        });
        map.fitBounds(bounds);
      }
    };

    updateRestaurantMarkers();
  }, [map, restaurants]);

// Handle custom location marker display only (clicking handled in Navbar)
useEffect(() => {
  if (!map || !searchParams.locationMode) return;

  const showCustomMarker = async () => {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    // If we have custom location coordinates, show the blue marker
    if (searchParams.latitude && searchParams.longitude && searchParams.locationMode === 'custom') {
      // Remove old custom marker if exists
      if (customMarker) {
        customMarker.map = null;
      }

      const bluePinElement = new PinElement({
        background: '#4285F4',
        borderColor: '#ffffff',
        glyphColor: '#ffffff'
      });

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: searchParams.latitude, lng: searchParams.longitude },
        content: bluePinElement.element,
        title: 'Custom Search Location'
      });

      setCustomMarker(marker);
      
      // Center map on custom location
      map.setCenter({ lat: searchParams.latitude, lng: searchParams.longitude });
      map.setZoom(13);
    } else if (customMarker && searchParams.locationMode !== 'custom') {
      // Remove custom marker if not in custom mode
      customMarker.map = null;
      setCustomMarker(null);
    }
  };

  showCustomMarker();
}, [map, searchParams.locationMode, searchParams.latitude, searchParams.longitude]);

  // Search Google Places when search params change
  useEffect(() => {
    if (!map) return;

    // Clear old Google Places markers (yellow ones)
    googlePlacesMarkers.forEach(marker => marker.map = null);
    setGooglePlacesMarkers([]);

    if (!searchParams.keyword || !searchParams.latitude || !searchParams.longitude) {
      onGooglePlacesUpdate([]);
      return;
    }

    searchNearbyPlaces();
  }, [map, searchParams.keyword, searchParams.latitude, searchParams.longitude, searchParams.radius]);

  const searchNearbyPlaces = async () => {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    // Center map on search location
    map.setCenter({ lat: searchParams.latitude, lng: searchParams.longitude });
    map.setZoom(13);

    const request = {
      textQuery: searchParams.keyword ? `${searchParams.keyword} restaurants` : 'restaurants',
      fields: ['displayName', 'location', 'formattedAddress', 'rating', 'websiteURI', 'id'],
      locationBias: {
        center: { lat: searchParams.latitude, lng: searchParams.longitude },
        radius: parseInt(searchParams.radius || 25) * 1000
      },
      maxResultCount: 10
    };

    try {
      const { places } = await Place.searchByText(request);

      if (places && places.length > 0) {
        onGooglePlacesUpdate(places);

        // Add yellow markers for Google Places
        const newGoogleMarkers = [];
        
        places.forEach(place => {
          const yellowPinElement = new PinElement({
            background: '#FFC107',
            borderColor: '#ffffff',
            glyphColor: '#333333'
          });

          const marker = new AdvancedMarkerElement({
            map: map,
            position: place.location,
            content: yellowPinElement.element,
            title: place.displayName
          });

          marker.addListener('click', () => {
            const rating = place.rating ? `⭐ ${place.rating}/5` : 'No rating';
            
            infoWindowRef.current.setContent(`
              <div style="padding: 10px; max-width: 250px;">
                <h5>${place.displayName}</h5>
                <p>${place.formattedAddress}</p>
                <p>${rating}</p>
                ${place.websiteURI ? `<a href="${place.websiteURI}" target="_blank">Website</a><br>` : ''}
                <span class="badge bg-warning text-dark">Google Places</span><br>
                <button class="btn btn-sm btn-success mt-2" id="save-place-${place.id}">
                  Save to Database
                </button>
              </div>
            `);
            infoWindowRef.current.open({ anchor: marker, map });

            setTimeout(() => {
              const saveBtn = document.getElementById(`save-place-${place.id}`);
              if (saveBtn) {
                saveBtn.onclick = () => {
                  onSaveGooglePlace({
                    name: place.displayName,
                    cuisine: 'Restaurant',
                    address: place.formattedAddress,
                    website: place.websiteURI || '',
                    latitude: place.location.lat(),
                    longitude: place.location.lng(),
                    user_added: false
                  });
                };
              }
            }, 100);
          });

          newGoogleMarkers.push(marker);
        });

        setGooglePlacesMarkers(newGoogleMarkers);
      } else {
        onGooglePlacesUpdate([]);
      }
    } catch (error) {
      console.error('Places API error:', error);
      onGooglePlacesUpdate([]);
    }
  };

  return <div ref={mapRef} id="map" style={{ width: '100%', height: '100%' }} />;
}

// Wrapper component to load Google Maps
function MapWithLoader(props) {
  return (
    <Wrapper apiKey={props.mapsApiKey} libraries={['places', 'marker']}>
      <MapComponent {...props} />
    </Wrapper>
  );
}

export default MapWithLoader;