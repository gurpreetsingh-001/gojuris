// src/components/Footer.jsx
import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter subscription:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-3">
  <div 
    className="rounded-circle d-flex align-items-center justify-content-center me-2"
    style={{ 
      // background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      width: '40px', 
      height: '40px' 
    }}
  >
    <img 
      src="/reverselogo.png" 
      alt="GoJuris" 
      style={{ 
        width: '24px', 
        height: '24px',
        objectFit: 'contain'
      }}
    />
  </div>
  <h4 className="text-white mb-0 fw-bold">GoJuris</h4>
</div>
            <p className="text-light mb-4" style={{ lineHeight: '1.6', color: '#CBD5E0 !important' }}>
              Leading legal research platform providing comprehensive legal services with advanced AI technology and experienced professionals.
            </p>
            
            {/* Social Icons */}
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 text-white" style={{ width: '40px', height: '40px', borderColor: '#4A5568' }}>
                <i className="bx bxl-facebook text-center"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 text-white" style={{ width: '40px', height: '40px', borderColor: '#4A5568' }}>
                <i className="bx bxl-twitter text-center"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 text-white" style={{ width: '40px', height: '40px', borderColor: '#4A5568' }}>
                <i className="bx bxl-linkedin text-center"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 text-white" style={{ width: '40px', height: '40px', borderColor: '#4A5568' }}>
                <i className="bx bxl-instagram text-center"></i>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-3">Useful Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Home</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Terms & Conditions</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Testimonials</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Why We?</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-3">Products</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Desktop Version</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Online Version</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Mobile/Tab Version</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>MAC Version</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Ubuntu Version</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-3">Contact</h5>
            
            <div className="mb-3">
              <div className="d-flex align-items-start mb-2">
                <i className="bx bx-map text-primary me-2 mt-1"></i>
                <div>
                  <small className="text-white fw-semibold d-block">Capital Law Infotech</small>
                  <small style={{ color: '#CBD5E0' }}>
                    Regd Office: 3/88, Ram Street, Vishwas Nagar, DELHI – 110032
                  </small>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="d-flex align-items-start mb-2">
                <i className="bx bx-map text-primary me-2 mt-1"></i>
                <small style={{ color: '#CBD5E0' }}>
                  <strong>Branch:</strong> D-142, Lower Gr Floor, Lajpat Nagar-I, New Delhi – 110 024
                </small>
              </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-start mb-2">
                <i className="bx bx-map text-primary me-2 mt-1"></i>
                <small style={{ color: '#CBD5E0' }}>
                  <strong>Mumbai Office:</strong> 2nd Floor, Fine Mansion, Near Mumbai Bank, D. N. Road, Fort, Mumbai 400001 (India)
                </small>
              </div>
            </div>
            </div>

            <div className="mb-2">
              <div className="d-flex align-items-center">
                <i className="bx bx-envelope text-primary me-2"></i>
                <small style={{ color: '#CBD5E0' }}>support@gojuris.in</small>
              </div>
            </div>
            
            <div>
              <div className="d-flex align-items-center">
                <i className="bx bx-phone text-primary me-2"></i>
                <small style={{ color: '#CBD5E0' }}>93102 26000, 96256 81126</small>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-3">Newsletter</h5>
            <p className="mb-3" style={{ color: '#CBD5E0' }}>
              Subscribe to get the latest legal research tips and updates.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mb-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control text-white"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    backgroundColor: '#4A5568',
                    border: '1px solid #4A5568',
                    color: '#FFFFFF'
                  }}
                />
                <button 
                  className="btn text-white" 
                  type="submit"
                  style={{ backgroundColor: '#8B5CF6', border: '1px solid #8B5CF6' }}
                >
                  <i className="bx bx-right-arrow-alt"></i>
                </button>
              </div>
            </form>
            
            {isSubscribed && (
              <div className="alert alert-success alert-sm py-2">
                <small>Successfully subscribed!</small>
              </div>
            )}
            
            <small style={{ color: '#CBD5E0' }}>
              By subscribing you agree to our{' '}
              <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
            </small>
          </div>
        </div>

        {/* Bottom Section */}
        <hr style={{ borderColor: '#4A5568' }} className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <small style={{ color: '#CBD5E0' }}>
              © 2024 GoJuris Legal Platform. All rights reserved.
            </small>
          </div>
          <div className="col-md-6 text-md-end mt-2 mt-md-0">
            <small>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#CBD5E0' }}>Privacy Policy</a>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#CBD5E0' }}>Terms of Service</a>
              <a href="#" className="text-decoration-none" style={{ color: '#CBD5E0' }}>Cookie Policy</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;