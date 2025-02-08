import React from 'react';
import '../../styles/BusinessSection.css';

const BusinessSection = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <div className="business-card text-center">
            <img src="path/to/your/image1.jpg" alt="Feed your employees" className="img-fluid" />
            <h3>Feed your employees</h3>
            <p>Create a business account</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="business-card text-center">
            <img src="path/to/your/image2.jpg" alt="Your restaurant, delivered" className="img-fluid" />
            <h3>Your restaurant, delivered</h3>
            <p>Add your restaurant</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="business-card text-center">
            <img src="path/to/your/image3.jpg" alt="Deliver with Uber Eats" className="img-fluid" />
            <h3>Deliver with Uber Eats</h3>
            <p>Sign up to deliver</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSection;