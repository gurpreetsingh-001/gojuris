// src/components/Hero.jsx
import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="position-relative pt-md-3 pt-lg-5 mb-md-3 mb-lg-5" 
      ref={heroRef}
    >
      <div className="container position-relative zindex-5 pt-5">
        <div className="row mt-4 pt-5">
          <div className="col-xl-4 col-lg-5 text-center text-lg-start pb-3 pb-md-4 pb-lg-0">
            <h1 className="fs-xl text-uppercase mb-3 slide-in-left">
              Professional Medical Center
            </h1>
            <h2 className="display-4 pb-md-2 pb-lg-4 slide-in-left">
              We Take Care of Your Health
            </h2>
            <p className="fs-lg slide-in-left">
              Don't have insurance? 
              <a href="#contact" className="fw-medium text-decoration-none ms-1">
                Click here.
              </a>
            </p>
          </div>
          
          <div className="col-xl-5 col-lg-6 offset-xl-1 position-relative zindex-5 mb-5 mb-lg-0">
            <div className="card bg-primary border-0 shadow-primary py-2 p-sm-4 p-lg-5 slide-in-right">
              <div className="card-body p-lg-3">
                <h3 className="text-light pb-1 pb-md-3 h2">Silicon Medical Center</h3>
                <p className="fs-lg text-light pb-2 pb-md-0 mb-4 mb-md-5">
                  Our medical center provides a wide range of health care services. 
                  We use only advanced technologies to keep your family happy and healthy, 
                  without any unexpected surprises. We appreciate your trust greatly. 
                  Our patients choose us and our services because they know we are the best.
                </p>
                <button 
                  onClick={scrollToContact}
                  className="btn btn-light btn-lg"
                >
                  About Us
                  <i className="bx bx-right-arrow-alt lh-1 fs-4 ms-2 me-n2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-none d-lg-block" style={{ marginTop: '-165px' }}></div>
        <div className="row align-items-end">
          <div className="col-lg-6 d-none d-lg-block">
            {/* CSS-only medical facility illustration */}
            <div 
              className="rounded-3 bg-gradient-primary d-flex align-items-center justify-content-center text-white"
              style={{
                height: '400px',
                backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              }}
            >
              <div className="text-center">
                <i className="bx bx-plus-medical display-1 mb-3"></i>
                <h4>Medical Facility</h4>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex align-items-center ps-xl-5 mb-4 mb-md-0">
              <div className="btn btn-icon btn-secondary btn-lg pe-none rounded d-lg-none d-xl-inline-flex">
                <i className="bx bx-time text-primary fs-3"></i>
              </div>
              <ul className="list-unstyled ps-3 ps-lg-0 ps-xl-3 mb-0">
                <li><strong className="text-dark">Mon — Fri:</strong> 9:00 am — 22:00 pm</li>
                <li><strong className="text-dark">Sat — Sun:</strong> 9:00 am — 20:00 pm</li>
              </ul>
            </div>
            <button 
              onClick={scrollToContact}
              className="btn btn-primary btn-lg shadow-primary"
            >
              Make an appointment
            </button>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="d-none d-lg-block position-absolute top-0 end-0 w-50 d-flex flex-column ps-3" 
           style={{ height: 'calc(100% - 108px)' }}>
        <div 
          className="w-100 h-100 overflow-hidden bg-gradient-primary rounded-start"
          style={{ 
            borderBottomLeftRadius: '.5rem',
            backgroundImage: 'linear-gradient(45deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
          }}>
        </div>
      </div>
    </section>
  );
};

export default Hero;