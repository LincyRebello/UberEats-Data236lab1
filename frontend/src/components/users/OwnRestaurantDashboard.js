import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/DashboardStyles.css';
import { baseUrl } from '../../services/api-services';

const OwnRestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileUrl, setProfileUrl] = useState("");
  const [formData, setFormData] = useState({
    id: -1,
    name: '',
    description: '',
    location: '',
    contact_info: '',
    timings: '',
    image: null
  });
  const [error, setError] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ name: '', ingredients: '', price: '', image: null, category: 'Appetizer' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${baseUrl}/api/restaurants/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurant(response.data);
        setFormData({ ...response.data, image: null });
        if (response.data.image) {
          setProfileUrl(`${baseUrl}${response.data.image}`);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant profile:', error);
        setError('Failed to fetch restaurant data.');
        setLoading(false);
      }
    };

    const fetchDishes = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${baseUrl}/api/restaurants/dishes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDishes(response.data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchProfile();
    fetchDishes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    alert('Successfully logged out!');
    navigate('/login/restaurant');
  };

  const handleViewOrders = () => {
    navigate('/restaurant-orders');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDishChange = (e) => {
    setNewDish({ ...newDish, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`${baseUrl}/api/restaurants/${formData.id}/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      newDish.price = Number(newDish.price);
      const response = await axios.post(`${baseUrl}/api/restaurants/${formData.id}/dishes/`, newDish, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      response.data.price = Number(response.data.price);
      setDishes([...dishes, response.data]);
      setNewDish({ name: '', ingredients: '', price: '', image: null, category: 'Appetizer' });
      alert('Dish added successfully');
    } catch (error) {
      console.error('Error adding dish:', error);
      setError('Failed to add dish. Please try again.');
    }
  };

  const handleDeleteDish = async (dishId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${baseUrl}/api/restaurants/dishes/${dishId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDishes(dishes.filter(dish => dish.id !== dishId));
      alert('Dish deleted successfully');
    } catch (error) {
      console.error('Error deleting dish:', error);
      setError('Failed to delete dish. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setNewDish({ ...newDish, image: event.target.files[0] });
    }
  };

  const handleProfileFileChange = (event) => {
    if (event.target.files.length > 0) {
      var file = event.target.files[0];
      setFormData({ ...formData, image: file });
      const reader = new FileReader();

      reader.onload = function(e) {
        const imageUrl = e.target.result;
        setProfileUrl(imageUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <nav className="navbar navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand">
            Uber <span>Eats</span>
            <small className="d-block">for Merchants</small>
          </span>
          <div>
            <button onClick={handleViewOrders} className="btn btn-outline-light me-2">
              <FontAwesomeIcon icon={faClipboardList} /> Orders
            </button>
            <button onClick={handleLogout} className="btn btn-outline-light">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h2 className="mb-4">{restaurant?.name} - Dashboard</h2>
        
        <form onSubmit={handleUpdate} className="mb-5">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Restaurant Name"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Location"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info || ''}
                onChange={handleChange}
                placeholder="Contact Info"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="timings"
                value={formData.timings || ''}
                onChange={handleChange}
                placeholder="Timings"
                className="form-control"
              />
            </div>
            <div className="col-12">
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Description"
                className="form-control"
              />
            </div>
            <div className="col-12 d-flex align-items-center">
              {profileUrl ? (
                <>
                  <img src={profileUrl} alt="Profile" style={{ height: "50px", width: "50px", marginRight: "10px" }} />
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => { setProfileUrl(""); setFormData({ ...formData, image: null }) }}>Delete</button>
                </>
              ) : (
                <input type="file" onChange={handleProfileFileChange} className="form-control" />
              )}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </div>
          </div>
        </form>

        <hr />

        <h3 className="mb-3">Manage Dishes</h3>
        
        <form onSubmit={handleAddDish} className="mb-5">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="name"
                value={newDish.name}
                onChange={handleDishChange}
                placeholder="Dish Name"
                className="form-control"
              />
            </div>
            <div className='col-md-4'>
              <textarea
                name='ingredients'
                value={newDish.ingredients}
                onChange={handleDishChange}
                placeholder='Ingredients'
                className='form-control'
              />
            </div>
            <div className='col-md-4'>
              <input
                type='number'
                name='price'
                value={newDish.price}
                onChange={handleDishChange}
                placeholder='Price ($)'
                className='form-control'
              />
            </div>
            <div className='col-md-4'>
              <input type='file' onChange={handleFileChange} className='form-control' />
            </div>
            <div className='col-md-4'>
              <select value={newDish.category} onChange={handleDishChange} name='category' className='form-select'>
                  <option value=''>Select Category</option>
                  <option value='Appetizer'>Appetizer</option>
                  <option value='Salad'>Salad</option>
                  <option value='Main Course'>Main Course</option>
                  <option value='Dessert'>Dessert</option>
              </select>
            </div>
            <div className='col-md-4'>
              <button type='submit' disabled={!newDish.name || !newDish.ingredients || !newDish.price || !newDish.category} className='btn btn-success w-100'>
                Add Dish
              </button>
            </div>
          </div>
        </form>

        {dishes.length > 0 && (
          <>
            <h3 className="mb-3">Existing Dishes</h3>
            <div className='row'>
              {dishes.map((dish) => (
                <div key={dish.id} className='col-md-4 mb-3'>
                  <div className='card h-100'>
                    {dish.image && (
                      <img src={`${baseUrl}${dish.image}`} alt={dish.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                    )}
                    <div className='card-body'>
                      <h5 className="card-title">{dish.name}</h5>
                      <p className="card-text">{dish.ingredients}</p>
                      <span className="price-badge">${dish.price.toFixed(2)}</span>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <button className='btn btn-danger btn-sm w-100' onClick={() => handleDeleteDish(dish.id)}>Delete Dish</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OwnRestaurantDashboard;
