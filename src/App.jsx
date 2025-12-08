import { useState, useEffect } from 'react';
import { restaurantAPI } from './services/api';
import Navbar from './components/Navbar';
import MapComponent from './components/MapComponent';
import RestaurantTabs from './components/RestaurantTabs';
import AddRestaurantModal from './components/AddRestaurantModal';
import './styles/App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [mapsApiKey, setMapsApiKey] = useState('');

  // Load all restaurants on mount
  useEffect(() => {
    loadRestaurants();
    loadMapsKey();
  }, []);

  // Expose function to update custom location from map clicks
  useEffect(() => {
    window.updateCustomLocation = (lat, lng) => {
      setSearchParams(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        customLocation: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }));
    };

    return () => {
      delete window.updateCustomLocation;
    };
  }, []);

  // Load Google Maps API key from backend
  const loadMapsKey = async () => {
    try {
      const key = await restaurantAPI.getMapsKey();
      setMapsApiKey(key);
    } catch (error) {
      console.error('Error loading Maps API key:', error);
    }
  };

  // Load all restaurants from API
  const loadRestaurants = async () => {
    try {
      const data = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  // Handle search (use backend search when params are provided)
  const handleSearch = async (params) => {
    try {
      setSearchParams(params);

      let data;
      if (params?.keyword || (params?.latitude && params?.longitude)) {
        data = await restaurantAPI.search(params);
      } else {
        data = await restaurantAPI.getAll();
      }

      // Sort closest-first if distance is present in payload
      if (Array.isArray(data)) {
        data = [...data].sort((a, b) => {
          const da = a.distance ?? Number.MAX_SAFE_INTEGER;
          const db = b.distance ?? Number.MAX_SAFE_INTEGER;
          return da - db;
        });
      }

      setRestaurants(data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Handle adding restaurant
  const handleAddRestaurant = async (restaurantData) => {
    try {
      await restaurantAPI.create(restaurantData);
      await loadRestaurants();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Failed to add restaurant');
    }
  };

  // Handle updating restaurant
  const handleUpdateRestaurant = async (id, restaurantData) => {
    try {
      await restaurantAPI.update(id, restaurantData);
      await loadRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Failed to update restaurant');
    }
  };

  // Handle deleting restaurant
  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(id);
        await loadRestaurants();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        alert('Failed to delete restaurant');
      }
    }
  };

  // Handle Google Places results from map
  const handleGooglePlacesUpdate = (places) => {
    setGooglePlaces(places);
  };

  // Handle saving Google Place to database
  const handleSaveGooglePlace = async (placeData) => {
    try {
      await restaurantAPI.create(placeData);
      await loadRestaurants();
      alert('Restaurant saved to database!');
    } catch (error) {
      console.error('Error saving Google Place:', error);
      alert('Failed to save restaurant');
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="foodbud-header">
        <div className="container">
          <a href="/" className="foodbud-logo">FoodBud</a>
        </div>
      </div>

      {/* Navbar with Search */}
      <Navbar 
        onSearch={handleSearch}
        onAddClick={() => setShowModal(true)}
      />

      {/* Main Content */}
      <div className="container-fluid main-content-wrapper">
        <div className="row h-100">
          {/* Left Sidebar - Tabs */}
          <div className="col-md-4 sidebar-container">
            <RestaurantTabs
              restaurants={restaurants}
              googlePlaces={googlePlaces}
              searchParams={searchParams}
              onDelete={handleDeleteRestaurant}
              onUpdate={handleUpdateRestaurant}
              onSaveGooglePlace={handleSaveGooglePlace}
            />
          </div>

          {/* Right Side - Map */}
          <div className="col-md-8 map-container">
            {mapsApiKey && (
              <MapComponent
                restaurants={restaurants}
                searchParams={searchParams}
                mapsApiKey={mapsApiKey}
                onGooglePlacesUpdate={handleGooglePlacesUpdate}
                onSaveGooglePlace={handleSaveGooglePlace}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAddRestaurant}
      />
    </div>
  );
}

export default App;
