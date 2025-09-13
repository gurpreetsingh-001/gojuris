// src/components/VideoSection.jsx
import React, { useState, useRef, useEffect } from 'react';

const VideoSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleVideoClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setShowVideo(true);
      setIsLoading(false);
    }, 800);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <section 
      className="container text-center py-2 mb-0" 
      ref={sectionRef}
    >
      <h2 className="h1 pt-0 mb-2">See,How Gojuris AI Works</h2>
      <div className="row justify-content-center mb-2">
        <div className="col-lg-6 col-md-8">
          <p className="fs-lg text-muted mb-2">
           Watch our quick demo and see how Gojuris AI transforms legal research into a faster, smarter experience
          </p>
        </div>
      </div>
      
      <div className="position-relative rounded-3 overflow-hidden mb-0">
        {!showVideo ? (
          <>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center zindex-5">
              <button 
                onClick={handleVideoClick}
                className="btn btn-light btn-lg rounded-circle shadow-lg"
                aria-label="Play video"
                disabled={isLoading}
                style={{
                  width: '80px',
                  height: '80px',
                  border: 'none',
                  fontSize: '2rem'
                }}
              >
                {isLoading ? (
                  <div className="spinner-border text-primary" role="status" style={{width: '2rem', height: '2rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <i className="bx bx-play text-primary"></i>
                )}
              </button>
            </div>
            <span className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-35"></span>
            {/* CSS-only placeholder for video cover */}
            <div 
              className="bg-gradient-primary d-flex align-items-center justify-content-center text-white"
              style={{
                height: '400px',
                backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
              }}
            >
              <div className="text-center">
                <i className="bx bx-video fs-1 mb-3"></i>
                <h4>Medical Center Video</h4>
                <p className="mb-0">Click to watch our facility tour</p>
              </div>
            </div>
          </>
        ) : (
          <div className="position-relative">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/wJC1LFT_GD0?autoplay=1&rel=0&modestbranding=1"
                title="Medical Center Video"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <button
              onClick={handleCloseVideo}
              className="btn btn-close position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2"
              aria-label="Close video"
            ></button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;