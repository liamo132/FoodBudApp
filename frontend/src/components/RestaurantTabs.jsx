import { useState } from 'react';
import RestaurantCard from './RestaurantCard';

function RestaurantTabs({ restaurants, googlePlaces, searchParams, onDelete, onSaveGooglePlace, onUpdate }) {
  const [activeTab, setActiveTab] = useState('search-results');

  const savedRestaurants = restaurants.filter((r) => !r.user_added);
  const userAddedRestaurants = restaurants.filter((r) => r.user_added);

  return (
    <>
      {/* Legend */}
      <div className="sticky-legend">
        <div className="alert alert-info mb-3">
          <strong>Map Legend:</strong>
          <br />
          🔴 Saved Restaurants
          <br />
          🟢 User Added
          <br />
          🟡 Google Places
          <br />
          🔵 Custom Search Location
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'search-results' ? 'active' : ''}`}
              onClick={() => setActiveTab('search-results')}
            >
              Search Results <span className="badge bg-warning text-dark">{googlePlaces.length}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Places ({savedRestaurants.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'user-added' ? 'active' : ''}`}
              onClick={() => setActiveTab('user-added')}
            >
              User Added ({userAddedRestaurants.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="scrollable-content">
        {/* Search Results Tab */}
        {activeTab === 'search-results' && (
          <div>
            {googlePlaces.length > 0 ? (
              googlePlaces.map((place) => (
                <div key={place.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">
                      {place.displayName}
                      <span className="badge bg-warning text-dark ms-2">Google</span>
                    </h5>
                    <p className="card-text">
                      <strong>Address:</strong> {place.formattedAddress}
                      <br />
                      <strong>Rating:</strong> {place.rating ? `⭐ ${place.rating}/5` : 'No rating'}
                      <br />
                      {place.websiteURI && (
                        <>
                          <strong>Website:</strong>{' '}
                          <a href={place.websiteURI} target="_blank" rel="noopener noreferrer">
                            {place.websiteURI}
                          </a>
                        </>
                      )}
                    </p>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          onSaveGooglePlace({
                            name: place.displayName,
                            cuisine: 'Restaurant',
                            address: place.formattedAddress,
                            website: place.websiteURI || '',
                            latitude: place.location.lat(),
                            longitude: place.location.lng(),
                            user_added: false
                          })
                        }
                      >
                        Save to Database
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat()},${place.location.lng()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-info"
                      >
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Search for restaurants to see Google Places results here!</p>
            )}
          </div>
        )}

        {/* Saved Places Tab */}
        {activeTab === 'saved' && (
          <div>
            {savedRestaurants.length > 0 ? (
              savedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} onDelete={onDelete} onUpdate={onUpdate} />
              ))
            ) : (
              <p className="text-muted">No saved restaurants yet.</p>
            )}
          </div>
        )}

        {/* User Added Tab */}
        {activeTab === 'user-added' && (
          <div>
            {userAddedRestaurants.length > 0 ? (
              userAddedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} onDelete={onDelete} onUpdate={onUpdate} />
              ))
            ) : (
              <p className="text-muted">
                No user-added restaurants yet. Click "Add Your Own Restaurant" to create one!
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default RestaurantTabs;
