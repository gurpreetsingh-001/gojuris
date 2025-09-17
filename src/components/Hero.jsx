// src/components/Hero.jsx
import React, { useEffect, useRef } from 'react';
import gImage from '../assets/gohurisheader.png';
import backgroundImage from '../assets/background.svg';

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
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        minHeight: '80vh',
        padding: '60px 0'
      }}
    >
      {/* Background Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,249,250,0.75) 100%)',
          zIndex: 1
        }}
      />

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center" style={{ minHeight: '70vh' }}>
          {/* Left Content */}
          <div className="col-lg-6">
            {/* Law Meets AI Badge */}
            <div className="d-inline-flex align-items-center bg-primary rounded-pill px-4 py-2 mb-4">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: '24px', height: '24px' }}
              >
                <i className="bx bx-play text-primary" style={{ fontSize: '12px' }}></i>
              </div>
              <span className="text-white" style={{ fontSize: '16px', fontWeight: '500' }}>
                Law Meets Artificial Intelligence
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4" style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              lineHeight: '1.1',
              color: '#1a1a1a'
            }}>
              Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Virtual  
              </span>
              <br />
              Assistant for Legal              
              <br />
              Excellence
            </h1>

            {/* Button and Description Layout - FIXED VERSION */}
           {/* Button and Description Layout - ADJUSTED WIDTHS */}
<div className="d-flex flex-column flex-lg-row align-items-start mb-5">
  {/* Wider Button */}
  <div
    onClick={scrollToContact}
    style={{
      fontSize: '16px',
      fontWeight: '500',
      padding: '16px 32px',  // Increased padding for wider button
      borderRadius: '8px',
      backgroundColor: '#8b5cf6',
      color: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',  // Center the content
      gap: '8px',
      marginRight: '2rem',  // Increased margin between button and text
      marginBottom: '1rem',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      userSelect: 'none',
      minWidth: '180px',  // Minimum width for button
      whiteSpace: 'nowrap'  // Prevent text wrapping
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.backgroundColor = '#7c3aed';
      e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.backgroundColor = '#8b5cf6';
      e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
    }}
  >
    Sign Up Now
    <i className="bx bx-right-arrow-alt" style={{ fontSize: '16px', color: '#ffffff' }}></i>
  </div>

  {/* Narrower Text */}
  <p style={{
    fontSize: '16px',
    lineHeight: '1.6',
    maxWidth: '380px',  // Reduced from 480px to 380px
    color: '#6b7280',
    margin: 0,
    flex: '1'  // Allow text to take remaining space
  }}>
    GoJuris AI is your intelligent legal research assistant, built to simplify complex case law, statutes, and legal principles. With advanced AI Search, AI Chat, and powerful keyword tools, it delivers precise, court-ready results in seconds. Covering decades of judgments, statutes, amendments, and legal insights, GoJuris AI ensures faster, smarter, and reliable research — anytime, anywhere.
  </p>
</div>

            {/* Discover More */}
            <div className="mt-4">
              <div 
                className="d-flex align-items-center"
                style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                <i className="bx bx-chevron-down me-1"></i>
                Discover more
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="col-lg-6">
            <div className="text-center">
              <img
                src={gImage}
                alt="GoJuris AI Assistant"
                className="img-fluid"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.2))',
                  animation: 'float 6s ease-in-out infinite'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
                      border-radius: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-size: 4rem;
                      width: 100%;
                      max-width: 400px;
                      height: 400px;
                      margin: 0 auto;
                    ">
                      <i class="bx bx-bot"></i>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .hero-section {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .hero-section.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 991.98px) {
          .hero-section {
            min-height: 70vh !important;
            padding: 40px 0 !important;
            text-align: center;
          }
          
          .hero-section .d-flex.flex-column.flex-lg-row {
            align-items: center !important;
            flex-direction: column !important;
          }
          
          .hero-section .d-flex.flex-column.flex-lg-row > div:first-child {
            margin-right: 0 !important;
            margin-bottom: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 60vh !important;
            padding: 30px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;