// Profile.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../services/api-services';

const Profile = () => {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState("");
  const [profile, setProfile] = useState({
    name: '',
    date_of_birth: '',
    city: '',
    state: '',
    country: '',
    email: '',
    phone_number: '',
    profile_picture: null
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`${baseUrl}/api/customers/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      var profile = {
        ...response.data,
        profile_picture: null,
        date_of_birth: response.data.date_of_birth || ''
      };
      setProfile(profile);
      if (response.data.profile_picture) {
        setProfileUrl(`${baseUrl}${response.data.profile_picture}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile data.');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`${baseUrl}/api/customers/profile/`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setSuccessMessage('Profile updated successfully!');
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleProfileFileChange = (event) => {
    if (event.target.files.length > 0) {
      var file = event.target.files[0];
      setProfile({ ...profile, profile_picture: file });
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        setProfileUrl(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Profile Information</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Enter your name" />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="date_of_birth" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="date_of_birth" value={profile.date_of_birth} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="city" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" name="city" value={profile.city} onChange={handleChange} placeholder="Enter city" />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="state" className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" name="state" value={profile.state} onChange={handleChange} placeholder="Enter state" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="country" className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select name="country" value={profile.country} onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                <option value="India">India</option>
                <option value="Brazil">Brazil</option>
                <option value="Mexico">Mexico</option>
                <option value="South Africa">South Africa</option>
                <option value="Argentina">Argentina</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Sweden">Sweden</option>
                <option value="Norway">Norway</option>
                <option value="Denmark">Denmark</option>
                <option value="Finland">Finland</option>
                <option value="Switzerland">Switzerland</option>
                {/* Add more countries as needed */}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="phone_number" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" name="phone_number" value={profile.phone_number} onChange={handleChange} placeholder="Enter phone number" />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="profile_picture" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <div className="d-flex align-items-center">
            {profileUrl && (
              <div>
                <Image src={profileUrl} roundedCircle height="50" width="50" className="me-2" />
                <Button variant="danger" size="sm" onClick={() => setProfileUrl("")}>
                  Remove
                </Button>
              </div>
            )}
            <Form.Control type="file" onChange={handleProfileFileChange} className="ms-3" />
          </div>
        </Form.Group>

        <div className="d-flex">
          <Button variant="primary" type="submit" className="me-3">
            Update Profile
          </Button>
          <Button variant="secondary" onClick={goToDashboard}>
            Go to Dashboard
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Profile;