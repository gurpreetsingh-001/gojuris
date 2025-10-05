// src/components/Hero.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gImage from '../assets/gohurisheader.png';
import backgroundImage from '../assets/background.svg';

const Hero = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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


  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleDiscoverClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
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
          minHeight: '62vh',
          padding: '10px 0'
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
          <div className="row align-items-center" style={{ minHeight: '60vh' }}>
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
                  Powered by Legal Eagle              
                </span>
              </div>
               <img src="ic_beta_96.png"
        style={{
          marginLeft: '10px'
        }}>

        </img>
              {/* Main Heading */}
              <h3 className="mb-4" style={{ 
                fontWeight: '700',
                lineHeight: '1.1',
                color: '#1a1a1a',
                fontSize:'48px'

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
              </h3>
              {/* Button and Description Layout */}
              <div className="d-flex flex-column flex-lg-row align-items-start mb-5">
                {/* Sign Up Button */}
                <div
                  onClick={handleSignUpClick}
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginRight: '2rem',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    userSelect: 'none',
                    minWidth: '180px',
                    whiteSpace: 'nowrap'
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

                {/* Description Text */}
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  maxWidth: '380px',
                  color: '#6b7280',
                  margin: 0,
                  flex: '1'
                }}>
                  GoJuris AI is your intelligent legal research assistant, built to simplify complex case law, statutes, and legal principles. 
                </p>
              </div>

              {/* Discover More - Opens Modal */}
              <div className="mt-4">
                <div 
                  className="d-flex justify-content-end"
                  onClick={handleDiscoverClick}
                  style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
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
                    paddingTop:'0px',
                    paddingBottom:'0px',
                    marginBottom:'0px',
                    marginTop:'0px',
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
            margin-top:30px;
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

     {/* Discover More Modal */}
{showModal && (
  <>
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: '60px' }}
      onClick={closeModal}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: '2rem' }}
      >
        <div className="modal-content" style={{ 
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" style={{
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              GoJuris AI – The Next Generation of Legal Research
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pt-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#4b5563', marginBottom: '1rem' }}>
              GoJuris AI is your intelligent legal research assistant, designed to transform how lawyers, law firms, and legal professionals access and interpret the law. It simplifies the most complex case law, statutes, regulations, and legal principles into clear, actionable insights—so you can focus on strategy, not searching.
            </p>
            
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#4b5563', marginBottom: '1rem' }}>
              With its cutting-edge <strong>AI Search</strong>, intuitive <strong>AI Chat</strong>, and advanced keyword tools, GoJuris AI delivers precise, court-ready results in seconds, eliminating the time-consuming hassles of traditional research. Whether you're preparing for arguments, drafting pleadings, or analyzing judgments, you get faster, smarter, and more reliable answers—anytime, anywhere.
            </p>

            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#4b5563', marginBottom: '1rem' }}>
              Built on decades of judgments, statutes, amendments, and curated legal insights, GoJuris AI goes beyond just retrieving data. It interprets the law in context, identifies relevant precedents, and highlights nuanced legal points—empowering you with the clarity and confidence you need for decisive legal action.
            </p>

            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#4b5563', marginBottom: '1rem' }}>
              Accessible on multiple devices, GoJuris AI ensures that your research is always within reach—secure, seamless, and consistently up-to-date. By combining speed, accuracy, and comprehensive coverage, it sets a new benchmark for AI-driven legal research in India.
            </p>

            <div className="mt-4 p-3 rounded" style={{ 
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '0', fontWeight: '500' }}>
                <i className="bx bx-info-circle me-2" style={{ color: '#8b5cf6' }}></i>
                Transform your legal research experience with the power of AI—trusted by legal professionals across India.
              </p>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={closeModal}
              style={{ borderRadius: '8px' }}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => {
                closeModal();
                navigate('/signup');
              }}
              style={{ 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </>
  );
};

export default Hero;