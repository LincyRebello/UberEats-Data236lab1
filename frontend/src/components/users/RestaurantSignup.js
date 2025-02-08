import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupRestaurant, selectAuthLoading, selectAuthError } from '../../slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../services/api-services';


const RestaurantSignup = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      location: ''
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);


  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const resultAction = await dispatch(signupRestaurant(formData));
          if (signupRestaurant.fulfilled.match(resultAction)) {
              setSuccess(true);
              setTimeout(() => navigate('/login/restaurant'), 2000);
          }
      } catch (err) {
          // Error is handled by Redux
      }
  };


  return (
      <div style={{ fontFamily: '"San Francisco", "System UI", sans-serif' }}>
          <div style={{ backgroundColor: 'black', padding: '10px', textAlign: 'left' }}>
              <h1 style={{ color: '#00B140', margin: 0 }}>
                   <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                   Uber <span style={{ color: '#00B140' }}>Eats</span>
                   </Link>
              </h1>
          </div>
          <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
              <div style={{ width: '100%', maxWidth: '400px' }}>
                  <div className="p-5">
                      <h2 className="text-center mb-4">Restaurant Signup</h2>
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                      {success && <div className="alert alert-success" role="alert">Signup successful! Redirecting to login...</div>}
                      <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                              <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  placeholder="Restaurant Name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                  style={{ backgroundColor: '#f0f0f0' }}
                              />
                          </div>
                          <div className="mb-3">
                              <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  placeholder="Email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                  style={{ backgroundColor: '#f0f0f0' }}
                              />
                          </div>
                          <div className="mb-3">
                              <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  placeholder="Password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                  style={{ backgroundColor: '#f0f0f0' }}
                              />
                          </div>
                          <div className="mb-3">
                              <input
                                  type="text"
                                  className="form-control"
                                  name="location"
                                  placeholder="Location"
                                  value={formData.location}
                                  onChange={handleChange}
                                  required
                                  style={{ backgroundColor: '#f0f0f0' }}
                              />
                          </div>
                          <div className="d-grid">
                              <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={loading}
                              >
                                  {loading ? (
                                      <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          Signing Up...
                                      </>
                                  ) : 'Sign Up'}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  );
};


export default RestaurantSignup;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { baseUrl } from '../../services/api-services';


// const RestaurantSignup = () => {
//    const [formData, setFormData] = useState({
//        name: '',
//        email: '',
//        password: '',
//        location: ''
//    });
//    const [loading, setLoading] = useState(false);
//    const [error, setError] = useState(null);
//    const [success, setSuccess] = useState(false);
//    const navigate = useNavigate();


//    const handleChange = (e) => {
//        setFormData({ ...formData, [e.target.name]: e.target.value });
//    };


//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setLoading(true);
//        setError(null);
//        setSuccess(false);


//        try {
//            await axios.post(`${baseUrl}/api/restaurants/register/`, formData);
//            setLoading(false);
//            setSuccess(true);
//            setTimeout(() => navigate('/login/restaurant'), 2000); // Redirect to restaurant login
//        } catch (err) {
//            setError('Signup failed. Please check your inputs and try again.');
//            setLoading(false);
//        }
//    };


//    return (
//        <div style={{ fontFamily: '"San Francisco", "System UI", sans-serif' }}>
//            <div style={{ backgroundColor: 'black', padding: '10px', textAlign: 'left' }}>
//                <h1 style={{ color: '#00B140', margin: 0 }}>
//                     <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
//                     Uber <span style={{ color: '#00B140' }}>Eats</span>
//                     </Link>
//                </h1>
//            </div>
//            <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
//                <div style={{ width: '100%', maxWidth: '400px' }}>
//                    <div className="p-5">
//                        <h2 className="text-center mb-4">Restaurant Signup</h2>
//                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
//                        {success && <div className="alert alert-success" role="alert">Signup successful! Redirecting to login...</div>}
//                        <form onSubmit={handleSubmit}>
//                            <div className="mb-3">
//                                <input
//                                    type="text"
//                                    className="form-control"
//                                    name="name"
//                                    placeholder="Restaurant Name"
//                                    value={formData.name}
//                                    onChange={handleChange}
//                                    required
//                                    style={{ backgroundColor: '#f0f0f0' }}
//                                />
//                            </div>
//                            <div className="mb-3">
//                                <input
//                                    type="email"
//                                    className="form-control"
//                                    name="email"
//                                    placeholder="Email"
//                                    value={formData.email}
//                                    onChange={handleChange}
//                                    required
//                                    style={{ backgroundColor: '#f0f0f0' }}
//                                />
//                            </div>
//                            <div className="mb-3">
//                                <input
//                                    type="password"
//                                    className="form-control"
//                                    name="password"
//                                    placeholder="Password"
//                                    value={formData.password}
//                                    onChange={handleChange}
//                                    required
//                                    style={{ backgroundColor: '#f0f0f0' }}
//                                />
//                            </div>
//                            <div className="mb-3">
//                                <input
//                                    type="text"
//                                    className="form-control"
//                                    name="location"
//                                    placeholder="Location"
//                                    value={formData.location}
//                                    onChange={handleChange}
//                                    required
//                                    style={{ backgroundColor: '#f0f0f0' }}
//                                />
//                            </div>
//                            <div className="d-grid">
//                                <button
//                                    type="submit"
//                                    className="btn btn-primary"
//                                    disabled={loading}
//                                >
//                                    {loading ? (
//                                        <>
//                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                            Signing Up...
//                                        </>
//                                    ) : 'Sign Up'}
//                                </button>
//                            </div>
//                        </form>
//                    </div>
//                </div>
//            </div>
//        </div>
//    );
// };


// export default RestaurantSignup;
