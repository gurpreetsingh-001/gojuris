// src/components/CallToAction.jsx
import React from 'react';

const CallToAction = () => {
  return (
    <section className="container py-5 mb-md-3 mb-lg-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          {/* Doctor with laptop illustration */}
          <div 
            className="rounded-3 bg-light d-flex align-items-center justify-content-center position-relative overflow-hidden"
            style={{ height: '400px' }}
          >
            <div className="text-center text-muted">
              <i className="bx bx-laptop display-1 mb-3"></i>
              <div className="position-absolute top-0 start-0 m-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bx bx-user-voice text-white fs-4"></i>
                </div>
              </div>
              <div className="position-absolute bottom-0 end-0 m-4">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="bx bx-phone text-white fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 ps-lg-5">
          <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3">
            New Service
          </div>
          <h2 className="h1 mb-4">Start Your Care Online Now</h2>
          <p className="fs-lg text-muted mb-4">
            Get professional medical consultation from the comfort of your home. 
            Our experienced doctors are available 24/7 for online consultations, 
            prescription renewals, and health advice.
          </p>
          
          <div className="row g-4 mb-4">
            <div className="col-sm-6">
              <div className="d-flex align-items-start">
                <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                  <i className="bx bx-video"></i>
                </div>
                <div>
                  <h6 className="mb-1">Video Consultations</h6>
                  <p className="fs-sm text-muted mb-0">Face-to-face meetings with doctors</p>
                </div>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="d-flex align-items-start">
                <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                  <i className="bx bx-time-five"></i>
                </div>
                <div>
                  <h6 className="mb-1">24/7 Available</h6>
                  <p className="fs-sm text-muted mb-0">Round the clock medical support</p>
                </div>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="d-flex align-items-start">
                <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                  <i className="bx bx-receipt"></i>
                </div>
                <div>
                  <h6 className="mb-1">Digital Prescriptions</h6>
                  <p className="fs-sm text-muted mb-0">Instant prescription delivery</p>
                </div>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="d-flex align-items-start">
                <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                  <i className="bx bx-shield-check"></i>
                </div>
                <div>
                  <h6 className="mb-1">Secure & Private</h6>
                  <p className="fs-sm text-muted mb-0">HIPAA compliant platform</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <a href="/signup" className="btn btn-primary btn-lg d-flex align-items-center">
              <span>Signup</span>
              <i className="bx bx-right-arrow-alt ms-2"></i>
            </a>
            <a href="#" className="btn btn-outline-primary btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;