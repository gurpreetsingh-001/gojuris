// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container py-md-3 py-lg-4">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                   style={{ width: '40px', height: '40px' }}>
                <i className="bx bx-plus-medical text-white"></i>
              </div>
              <h5 className="text-white mb-0">Silicon</h5>
            </div>
            <p className="text-light mb-4" style={{ opacity: '0.8' }}>
              Leading medical center providing comprehensive healthcare services with 
              advanced technology and experienced professionals.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-icon btn-outline-light btn-sm text-white border-light">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="#" className="btn btn-icon btn-outline-light btn-sm text-white border-light">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="#" className="btn btn-icon btn-outline-light btn-sm text-white border-light">
                <i className="bx bxl-linkedin"></i>
              </a>
              <a href="#" className="btn btn-icon btn-outline-light btn-sm text-white border-light">
                <i className="bx bxl-instagram"></i>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Cardiology</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Surgery</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Radiology</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Family Medicine</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Dental Care</a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Our Doctors</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Appointments</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Emergency</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none footer-link">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-3">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-start">
                <i className="bx bx-map text-primary me-2 mt-1"></i>
                <span className="text-light" style={{ opacity: '0.8' }}>Noe Valley Bakery 24th Street, San Francisco, CA</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bx bx-phone text-primary me-2"></i>
                <a href="tel:4065550120" className="text-light text-decoration-none footer-link">(406) 555-0120</a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bx bx-envelope text-primary me-2"></i>
                <a href="mailto:info@silicon-medical.com" className="text-light text-decoration-none footer-link">info@silicon-medical.com</a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-3">Newsletter</h6>
            <p className="text-light mb-3" style={{ opacity: '0.8' }}>
              Subscribe to get the latest health tips and medical updates.
            </p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control bg-light text-dark border-0" 
                placeholder="Your email"
                aria-label="Email"
              />
              <button className="btn btn-primary border-0" type="button">
                <i className="bx bx-send"></i>
              </button>
            </div>
            <small className="text-light" style={{ opacity: '0.7' }}>
              By subscribing you agree to our Privacy Policy
            </small>
          </div>
        </div>
        
        <hr className="border-light my-4" style={{ opacity: '0.3' }} />
        
        <div className="d-md-flex align-items-center justify-content-between text-center text-md-start">
          <p className="text-light mb-md-0" style={{ opacity: '0.8' }}>
            © 2024 Silicon Medical Center. All rights reserved.
          </p>
          <div className="d-flex justify-content-center justify-content-md-end gap-4 mt-3 mt-md-0">
            <a href="#" className="text-light text-decoration-none footer-link">Privacy Policy</a>
            <a href="#" className="text-light text-decoration-none footer-link">Terms of Service</a>
            <a href="#" className="text-light text-decoration-none footer-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;