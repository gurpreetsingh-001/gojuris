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
        backgroundAttachment: 'scroll'
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
        <div className="row align-items-center hero-row">
          {/* Left Content with proper padding */}
          <div className="col-lg-7 col-xl-6 hero-content-col">
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
            <h1 className="hero-title mb-4">
              Your{' '}
              <span className="gradient-text">
                Virtual  
              </span>
              <br />
              Assistant for Legal              
              <br />
              Excellence
            </h1>

            {/* Button and Description Layout */}
            <div className="d-flex flex-column flex-lg-row align-items-start mb-5">
              <button
                onClick={scrollToContact}
                className="btn btn-primary hero-cta-btn me-lg-4 mb-3 mb-lg-0 flex-shrink-0"
              >
                Sign Up Now
                <i className="bx bx-right-arrow-alt ms-2"></i>             
              </button>

              <p className="hero-description text-muted mb-0">
                GoJuris AI is your intelligent legal research assistant, built to simplify complex case law, statutes, and legal principles. With advanced AI Search, AI Chat, and powerful keyword tools, it delivers precise, court-ready results in seconds. Covering decades of judgments, statutes, amendments, and legal insights, GoJuris AI ensures faster, smarter, and reliable research — anytime, anywhere.
              </p>
            </div>

            {/* Discover More */}
            <div className="mt-4">
              <button 
                className="btn btn-link text-muted p-0 d-flex align-items-center"
                style={{ fontSize: '14px', textDecoration: 'none' }}
              >
                <i className="bx bx-chevron-down me-1"></i>
                Discover more
              </button>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="col-lg-5 col-xl-6 hero-image-col">
            <div className="hero-image-container">
              <img
                src={gImage}
                alt="GoJuris AI Assistant"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Inline CSS */}
      <style>{`
        .hero-section {
          min-height: 50vh;
          padding: 40px 0 40px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          overflow: hidden;
          position: relative;
        }

        .hero-section.fade-in {
          opacity: 1;
          transform: translateY(0);
          animation: fadeInUp 0.7s cubic-bezier(.22,.9,.32,1) both;
        }

        .hero-row {
          min-height: 70vh;
          position: relative;
          z-index: 2;
        }

        .hero-content-col {
          padding-left: 80px;
          z-index: 3;
          position: relative;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          color: #1a1a1a;
        }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-cta-btn {
          font-size: 16px;
          font-weight: 500;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          transition: all 0.3s ease;
        }

        .hero-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.6;
          max-width: 480px;
          color: #6b7280;
        }

        .hero-image-col {
          position: relative;
          z-index: 2;
        }

        .hero-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          min-height: 500px;
        }

        .hero-image {
          max-width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: contain;
          filter: drop-shadow(0 10px 30px rgba(139, 92, 246, 0.2));
          animation: float 6s ease-in-out infinite;
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        /* Desktop Styles */
        @media (min-width: 1200px) {
          .hero-content-col {
            padding-left: 120px !important;
          }
          
          .hero-section {
            background-size: cover;
            background-position: center center;
            background-attachment: fixed;
          }
        }

        @media (min-width: 992px) {
          .hero-content-col {
            padding-left: 170px !important;
          }
          
          .hero-image-col {
            display: block !important;
          }
          
          .hero-section {
            background-size: cover;
            background-position: center center;
          }
        }

        /* Tablet Styles */
        @media (max-width: 991.98px) {
          .hero-section {
            min-height: 80vh;
            padding: 60px 0 40px;
            background-size: cover;
            background-position: center top;
            background-attachment: scroll;
          }

          .hero-content-col {
            padding-left: 40px !important;
            padding-right: 40px !important;
            text-align: center;
          }

          .hero-image-col {
            display: block !important;
            margin-top: 2rem;
          }

          .hero-image-container {
            min-height: 350px;
          }

          .hero-image {
            max-height: 350px;
          }

          .d-flex.flex-column.flex-lg-row {
            align-items: center !important;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 70vh;
            padding: 40px 0 30px;
            background-size: cover;
            background-position: center center;
            background-attachment: scroll;
          }

          .hero-content-col {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .hero-title {
            font-size: 2.2rem;
            margin-bottom: 1.5rem;
          }

          .hero-image-container {
            min-height: 280px;
          }

          .hero-image {
            max-height: 280px;
          }

          .hero-description {
            font-size: 15px;
            text-align: center;
          }

          .hero-cta-btn {
            justify-content: center;
            width: 100%;
            margin-bottom: 1rem !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .hero-section {
            min-height: 60vh;
            padding: 30px 0 20px;
            background-size: cover;
            background-position: center center;
          }

          .hero-content-col {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }

          .hero-title {
            font-size: 1.9rem;
          }

          .hero-image-container {
            min-height: 220px;
          }

          .hero-image {
            max-height: 220px;
          }

          .hero-description {
            font-size: 14px;
          }
        }

        /* Very Small Mobile */
        @media (max-width: 480px) {
          .hero-section {
            background-size: contain;
            background-position: center top;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;