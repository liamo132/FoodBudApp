import { useState } from 'react';

function AddRestaurantModal({ show, onHide, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    website: '',
    user_added: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      cuisine: '',
      address: '',
      website: '',
      user_added: false
    });
  };

  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Restaurant</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} id="addRestaurantForm">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cuisine" className="form-label">Cuisine</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="user_added"
                    name="user_added"
                    checked={formData.user_added}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="user_added">
                    Mark as User Added
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button type="submit" form="addRestaurantForm" className="btn btn-primary-tomato">
                Save Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddRestaurantModal;