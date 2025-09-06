// src/components/ContactMap.jsx
import React from 'react';

const ContactMap = () => {
  return (
    <section className="container py-5 mb-md-3 mb-lg-5">
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          {/* Map placeholder */}
          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center position-relative"
               style={{ height: '400px' }}>
            <div className="text-center text-muted">
              <i className="bx bx-map display-1 mb-3"></i>
              <h5>Interactive Map</h5>
              <p className="mb-0">Noe Valley Bakery 24th Street<br />San Francisco, CA, USA</p>
            </div>
            
            {/* Map markers */}
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center animate-pulse"
                   style={{ width: '40px', height: '40px' }}>
                <i className="bx bx-map-pin text-white"></i>
              </div>
            </div>
            
            {/* Additional location markers */}
            <div className="position-absolute" style={{ top: '30%', left: '30%' }}>
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                   style={{ width: '20px', height: '20px' }}>
                <i className="bx bx-plus-medical text-white" style={{ fontSize: '10px' }}></i>
              </div>
            </div>
            
            <div className="position-absolute" style={{ top: '70%', right: '25%' }}>
              <div className="bg-info rounded-circle d-flex align-items-center justify-content-center"
                   style={{ width: '20px', height: '20px' }}>
                <i className="bx bx-plus-medical text-white" style={{ fontSize: '10px' }}></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 ps-lg-5">
          <h2 className="h1 mb-4">Get Free Professional Consultation</h2>
          <p className="fs-lg text-muted mb-4">
            Book your appointment today and get expert medical advice from our experienced doctors.
          </p>
          
          <div className="row g-4 mb-4">
            <div className="col-sm-6">
              <div className="bg-light rounded-3 p-3 text-center">
                <i className="bx bx-phone-call text-primary fs-2 mb-2"></i>
                <h6 className="mb-1">Emergency</h6>
                <p className="text-primary fw-medium mb-0">(406) 555-0120</p>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="bg-light rounded-3 p-3 text-center">
                <i className="bx bx-calendar text-primary fs-2 mb-2"></i>
                <h6 className="mb-1">Appointments</h6>
                <p className="text-primary fw-medium mb-0">Book Online</p>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="bg-light rounded-3 p-3 text-center">
                <i className="bx bx-time-five text-primary fs-2 mb-2"></i>
                <h6 className="mb-1">Working Hours</h6>
                <p className="text-muted mb-0">24/7 Emergency</p>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="bg-light rounded-3 p-3 text-center">
                <i className="bx bx-support text-primary fs-2 mb-2"></i>
                <h6 className="mb-1">Support</h6>
                <p className="text-muted mb-0">Live Chat Available</p>
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-sm-row gap-3">
            <a href="#contact" className="btn btn-primary btn-lg">
              Book Appointment
              <i className="bx bx-calendar-plus lh-1 fs-4 ms-2"></i>
            </a>
            <a href="tel:4065550120" className="btn btn-outline-primary btn-lg">
              <i className="bx bx-phone-call lh-1 fs-4 me-2"></i>
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;