import { useState } from 'react';

function RestaurantCard({ restaurant, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    website: restaurant.website || '',
    user_added: restaurant.user_added
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    await onUpdate(restaurant.id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Edit Restaurant</h5>

          <div className="mb-2">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Cuisine</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Website</label>
            <input
              type="url"
              className="form-control form-control-sm"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="user_added"
              checked={formData.user_added}
              onChange={handleChange}
            />
            <label className="form-check-label">User Added</label>
          </div>

          <div className="btn-group">
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {restaurant.name}
          {restaurant.user_added && (
            <span className="badge bg-success ms-2">User Added</span>
          )}
        </h5>

        <p className="card-text">
          <strong>Cuisine:</strong> {restaurant.cuisine}
          <br />
          <strong>Address:</strong> {restaurant.address}
          <br />
          {restaurant.website && (
            <>
              <strong>Website:</strong>{' '}
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurant.website}
              </a>
            </>
          )}
        </p>

        <div className="btn-group">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(restaurant.id)}
          >
            Delete
          </button>

          {restaurant.latitude && restaurant.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-info"
            >
            Open in Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
