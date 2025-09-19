// src/components/NewSection.jsx
import React, { useRef, useEffect } from 'react';

const NewSection = () => {
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      className="container-fluid py-5 " 
      ref={sectionRef}
      id="new-section"
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="pe-lg-4">
              <h2 className="h1 mb-4">
                Mobile Application
              </h2>
              <p className="fs-lg text-muted mb-4">
                Access your AI legal assistant anytime, anywhere.
              </p>
              
              {/* Features list */}
              <div className="mb-4">
                <ul className="list-unstyled">
                  <li className="d-flex align-items-center mb-3">
                    <i className="bx bx-check-circle text-success me-3 fs-5"></i>
                    <span className="fs-6">iOS & Android Apps</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <i className="bx bx-check-circle text-success me-3 fs-5"></i>
                    <span className="fs-6">Voice Search</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <i className="bx bx-check-circle text-success me-3 fs-5"></i>
                    <span className="fs-6">Offline Mode</span>
                  </li>
                </ul>
              </div>

              {/* Download button */}
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button className="btn btn-primary btn-lg px-4 rounded-3">
                  <i className="bx bx-download me-2"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
          
          {/* Right side - Mobile image */}
          <div className="col-lg-6">
            <div className="text-center">
              <img 
                src="/mobile.jpg" 
                alt="Mobile Application" 
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: '500px', width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewSection;