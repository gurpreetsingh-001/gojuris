// src/components/Features.jsx
import React, { useEffect, useRef, useState } from 'react';

const Features = () => {
  const featuresRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  const features = [
    {
      icon: 'bx-search-alt-2',
      title: 'AI Search',
      description: 'Ask once. Find fast. AI-powered legal search at your command.',
      linkText: 'Read more',
      bgColor: 'bg-primary',
      modalContent: {
        title: 'AI Search',
        subtitle: 'Ask once. Find fast. AI-powered legal search at your command.',
        points: [
          'Discover smarter results instantly — GoJuris\' AI-powered search understands legal context, citations, and keywords, delivering precise case law and statutes in seconds.',
          'Go beyond keywords — Our AI search interprets your queries like a lawyer would, connecting facts, issues, and precedents for sharper insights.',
          'Structured and reliable — Find judgments, headnotes, issues, judges\' findings, parties contentions, facts and legal principles with AI-curated accuracy, saving you time and ensuring court-ready research.'
        ]
      }
    },
    {
      icon: 'bx-chat',
      title: 'AI Chat',
      description: 'Chat with your GoJuris E-library — GoJuris AI answers like your smartest associate.',
      linkText: 'Read more',
      bgColor: 'bg-danger',
      modalContent: {
        title: 'AI Chat',
        subtitle: 'Chat with your GoJuris E-library — GoJuris AI answers like your smartest associate.',
        points: [
          'From queries to clarity — Ask in plain language, get structured legal answers.',
          'GoJuris AI Chat allows lawyers to interact with case law, statutes, and legal principles in natural language.',
          'It provides structured, citation-backed responses, saving hours of manual research.',
          'Designed for accuracy and context, it works like a virtual junior counsel — always ready with court-prepared answers.'
        ]
      }
    },
    {
      icon: 'bx-book-bookmark',
      title: 'Subject/Keyword Search',
      description: 'Search by subject, filter by keyword — precision at your fingertips.',
      linkText: 'Read more',
      bgColor: 'bg-warning',
      modalContent: {
        title: 'Subject/Keyword Search',
        subtitle: 'Search by subject, filter by keyword — precision at your fingertips.',
        points: [
          'GoJuris Subject/Keyword Search enables quick navigation through vast legal databases by topic or keyword.',
          'It organizes judgments under structured subject headings and provides instant keyword-based filtering.',
          'This feature ensures targeted research, helping users pinpoint relevant case laws and legal principles efficiently.'
        ]
      }
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('fade-in');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const openModal = (index) => {
    setActiveModal(index);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (activeModal !== null) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  return (
    <>
      {/* Features Section */}
      <section className="container pt-4 mb-2 mb-md-4" ref={featuresRef}>
        <div className="text-center" style={{ marginBottom: '2px' }}>
          <h2 className="h1 mb-3 text-primary">What's New in GoJuris.ai</h2>
        </div>
        
        <div className="row row-cols-1 row-cols-md-3 g-4  pt-md-4 pb-lg-2">
          {features.map((feature, index) => (
            <div key={index} className="col">
              <div className="card flex-column align-items-center card-hover border-primary h-100 feature-card text-center p-4">
                <div className={`rounded-circle ${feature.bgColor} d-flex align-items-center justify-content-center mb-4`} 
                     style={{width: '80px', height: '80px'}}>
                  <i className={`bx ${feature.icon} text-white`} style={{fontSize: '40px'}}></i>
                </div>
                <div className="card-body text-center p-0">
                  <h3 className="h5 mb-3">{feature.title}</h3>
                  <p className="fs-sm mb-4">{feature.description}</p>
                  <button 
                    onClick={() => openModal(index)}
                    className="btn btn-link stretched-link px-0 text-decoration-none"
                  >
                    {feature.linkText}
                    <i className="bx bx-right-arrow-alt fs-xl ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {activeModal !== null && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center">
                  <div className={`rounded-circle ${features[activeModal].bgColor} d-flex align-items-center justify-content-center me-3`} 
                       style={{width: '50px', height: '50px'}}>
                    <i className={`bx ${features[activeModal].icon} text-white`} style={{fontSize: '24px'}}></i>
                  </div>
                  <h4 className="modal-title mb-0">{features[activeModal].modalContent.title}</h4>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body pt-2">
                <p className="text-muted mb-4 fs-lg">
                  <strong>{features[activeModal].modalContent.subtitle}</strong>
                </p>
                
                <div className="mb-3">
                 
                  <ul className="list-unstyled">
                    {features[activeModal].modalContent.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="mb-3 d-flex align-items-start">
                        <i className="bx bx-check-circle text-primary me-2 mt-1 flex-shrink-0"></i>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={closeModal}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop Click Handler */}
      {activeModal !== null && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: -1 }}
          onClick={closeModal}
        ></div>
      )}
    </>
  );
};

export default Features;