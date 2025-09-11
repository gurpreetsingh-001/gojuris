// src/components/Hero.jsx
import React, { useEffect, useRef } from 'react';
import gImage from '../assets/gohurisheader.png';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
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
      ref={heroRef}
      className="hero-section position-relative mb-md-3 mb-lg-0"
      style={{ backgroundColor: '#f8f9fa', minHeight: '80vh', paddingTop: '10px' }}
    >
      <div className="container position-relative zindex-5">
        <div className="row align-items-center" style={{ minHeight: '80vh' }}>
          {/* Left Content */}
          <div className="col-lg-7 col-xl-6">
            {/* Digital Agency Badge */}
            <div className="d-inline-flex align-items-center bg-white rounded-pill px-3 py-2 mb-4 shadow-sm">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '24px', height: '24px' }}
              >
                <i className="bx bx-play text-white" style={{ fontSize: '12px' }}></i>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Law Meets Artificial Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1
              className="mb-4"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '700',
                lineHeight: '1.1',
                color: '#1a1a1a',
              }}
            >
              Your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Virtual  
              </span>
              <br />
Assistant for Legal              <br />
              Excellence
            </h1>

            {/* Button and Description */}
            <div className="d-flex flex-column flex-lg-row align-items-start mb-5">
              <button
                onClick={scrollToContact}
                className="btn btn-primary me-lg-4 mb-3 mb-lg-0 flex-shrink-0"
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '12px 24px',
                  borderRadius: '8px',
                }}
              >
Sign Up Now              </button>

              <p
                className="text-muted mb-0"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  maxWidth: '480px', // Increased from 300px to 480px
                }}
              >
                GoJuris is a leading full-service digital agency based in India. 
                We make legal research AI tools, websites & applications that legal professionals 
                appreciate all around the world.
              </p>
            </div>

            {/* Discover More */}
            <button
              onClick={scrollToContact}
              className="btn btn-link text-decoration-none p-0 d-flex align-items-center text-muted"
              style={{ fontSize: '14px' }}
            >
              <i className="bx bx-chevron-down me-2"></i>
              <span>Discover more</span>
            </button>
          </div>

          {/* Right Content - Image */}
          <div className="col-lg-5 col-xl-6 d-none d-lg-block">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
              <img
                src={gImage}
                alt="3D sphere header"
                className="hero-image"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS for this component */}
      <style>{`
        .hero-section {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .hero-section.fade-in {
          opacity: 1;
          transform: translateY(0);
          animation: fadeInUp 0.7s cubic-bezier(.22,.9,.32,1) both;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 992px) {
          .hero-image { max-height: 320px; }
        }
      `}</style>
    </section>
  );
};

export default Hero;