
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupCustomer, selectAuthLoading, selectAuthError } from '../../slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../services/api-services';


const CustomerSignup = () => {
   const [formData, setFormData] = useState({
       name: '',
       email: '',
       password: '',
       address: ''
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
           await dispatch(signupCustomer(formData)).unwrap();
           setSuccess(true);
           setTimeout(() => navigate('/login/customer'), 2000);
       } catch (err) {
           // Error is handled by the Redux slice
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
                       <h2 className="text-center mb-4">Customer Signup</h2>
                       {error && <div className="alert alert-danger" role="alert">{error}</div>}
                       {success && <div className="alert alert-success" role="alert">Signup successful! Redirecting to login...</div>}
                       <form onSubmit={handleSubmit}>
                           <div className="mb-3">
                               <input
                                   type="text"
                                   className="form-control"
                                   name="name"
                                   placeholder="Full Name"
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
                                   name="address"
                                   placeholder="Address"
                                   value={formData.address}
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


export default CustomerSignup;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { baseUrl } from '../../services/api-services';


// const CustomerSignup = () => {
//    const [formData, setFormData] = useState({
//        name: '',
//        email: '',
//        password: '',
//        address: ''
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
//            await axios.post(`${baseUrl}/api/customers/register/`, formData);
//            setLoading(false);
//            setSuccess(true);
//            setTimeout(() => navigate('/login/customer'), 2000); // Redirect to customer login
//        } catch (err) {
//            setError('Signup failed. Please try again.');
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
//                        <h2 className="text-center mb-4">Customer Signup</h2>
//                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
//                        {success && <div className="alert alert-success" role="alert">Signup successful! Redirecting to login...</div>}
//                        <form onSubmit={handleSubmit}>
//                            <div className="mb-3">
//                                <input
//                                    type="text"
//                                    className="form-control"
//                                    name="name"
//                                    placeholder="Full Name"
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
//                                    name="address"
//                                    placeholder="Address"
//                                    value={formData.address}
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


// export default CustomerSignup;
