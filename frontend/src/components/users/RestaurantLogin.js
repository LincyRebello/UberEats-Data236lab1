

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginRestaurant, selectAuthLoading, selectAuthError } from '../../slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../services/api-services';


const RestaurantLogin = () => {
  const [credentials, setCredentials] = useState({
      email: '',
      password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);


  const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
      e.preventDefault();
      const resultAction = await dispatch(loginRestaurant(credentials));
      if (loginRestaurant.fulfilled.match(resultAction)) {
          const restaurantId = resultAction.payload.restaurant_id;
          navigate(`/restaurant/${restaurantId}/dashboard`);
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
                      <h2 className="text-center mb-4">Restaurant Login</h2>
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                      <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                              <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  placeholder="Email"
                                  value={credentials.email}
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
                                  value={credentials.password}
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
                                          Logging in...
                                      </>
                                  ) : 'Log In'}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  );
};


export default RestaurantLogin;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { baseUrl } from '../../services/api-services';


// const RestaurantLogin = () => {
//    const [credentials, setCredentials] = useState({
//        email: '',
//        password: ''
//    });
//    const [loading, setLoading] = useState(false);
//    const [error, setError] = useState(null);
//    const navigate = useNavigate();


//    const handleChange = (e) => {
//        setCredentials({ ...credentials, [e.target.name]: e.target.value });
//    };


//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setLoading(true);
//        try {
//            const response = await axios.post(`${baseUrl}/api/restaurants/login/`, credentials);
//            const restaurantId = response.data.restaurant_id;


//            localStorage.setItem('access_token', response.data.access);
//            localStorage.setItem('refresh_token', response.data.refresh);


//            setLoading(false);
//            navigate(`/restaurant/${restaurantId}/dashboard`);
//        } catch (error) {
//            setError('Invalid email or password');
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
//                        <h2 className="text-center mb-4">Restaurant Login</h2>
//                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
//                        <form onSubmit={handleSubmit}>
//                            <div className="mb-3">
//                                <input
//                                    type="email"
//                                    className="form-control"
//                                    name="email"
//                                    placeholder="Email"
//                                    value={credentials.email}
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
//                                    value={credentials.password}
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
//                                            Logging in...
//                                        </>
//                                    ) : 'Log In'}
//                                </button>
//                            </div>
//                        </form>
//                    </div>
//                </div>
//            </div>
//        </div>
//    );
// };


// export default RestaurantLogin;
