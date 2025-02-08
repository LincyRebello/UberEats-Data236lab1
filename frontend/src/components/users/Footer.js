import React from 'react';
import '../../styles/Footer.css'; // You can add your own styles here
// import { useNavigate } from 'react-router-dom';


const Footer = () => {
// const navigate = useNavigate();


 // const handleNavigation = () => {
 //   navigate('/RestaurantMenuLin'); // Redirects to RestaurantMenu page
 // };
 return (
   <footer className="footer">
 <div className="container">
   <div className="row footer-top">
     <div className="col-md-3 footer-logo">
       <h2>Uber <span>Eats</span></h2>
     </div>
     <div className="col-md-6 footer-links">
       <div className="row">
         <div className="col-6 col-md-4 footer-column">
           <a href="#">Get Help</a>
           <a href="#">Buy gift cards</a>
           <a href="#">Sign up to deliver</a>
         </div>
         <div className="col-6 col-md-4 footer-column">
         {/* <span onClick={handleNavigation} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                 Restaurants Near me
               </span> */}
         </div>
         <div className="col-6 col-md-4 footer-column">
           <a href="#">About Uber Eats</a>
           <a href="#">Shop groceries</a>
           <a href="#">Terms</a>
           <a href="#">Privacy Policy</a>
         </div>
       </div>
     </div>
     <div className="col-md-3 footer-app-links">
       <a href="https://apps.apple.com/us/app/uber-eats-food-delivery/id1058959277"><img src={require('../../images/app.png')} alt="App Store" /></a>
       <a href="https://play.google.com/store/apps/details?id=com.ubercab.eats&hl=en_US"><img src={require('../../images/ap.png')} alt="Google Play" /></a>
     </div>
   </div>
   <div className="row footer-bottom">
     <div className="col-md-6 social-links">
       <a href="https://www.facebook.com/UberEats/"><i className="fab fa-facebook"></i></a>
       <a href="https://twitter.com/ubereats_uk?lang=en"><i className="fab fa-twitter"></i></a>
       <a href="https://www.instagram.com/ubereats/?hl=en"><i className="fab fa-instagram"></i></a>
     </div>
     <div className="col-md-3 footer-language">
       <a href="#">Lab1</a>
     </div>
     <div className="col-md-3 footer-copyright">
       <p>© 2024 Uber Technologies Inc.</p>
       <p>Privacy Policy | Terms | Pricing | Do not sell or share my personal information</p>
     </div>
   </div>
 </div>
</footer>
 );
};


export default Footer;