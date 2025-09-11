// src/components/Services.jsx
import React, { useEffect, useRef, useState } from 'react';

const Services = () => {
  const servicesRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  const services = [
    {
      icon: 'bx-book-content',
      title: 'Case Law Repository',
      subtitle: 'Comprehensive collection of judgments from Supreme Court, High Courts, and Tribunals across India',
      description: 'Access to extensive case law database covering all major courts and judicial decisions.',
      hasDetailedContent: true,
      modalContent: {
        title: 'Case Law Repository',
        content: {
          sections: [
            {
              title: 'SUPREME COURT JUDGMENTS',
              items: ['Since 1950']
            },
            {
              title: 'ALL HIGH COURTS JUDGMENTS',
              items: [
                'ALLAHABAD (1874 till date)',
                'AP (Amaravati) (2019-till date)',
                'BOMBAY (1860-till date)',
                'CALCUTTA 1860-till date',
                'CHHATTISGARH 2000-till date',
                'DELHI 1966-till date',
                'GUJARAT 1947-till date',
                'GUWAHATI 1948-till date',
                'HIMACHAL PRADESH 1948-till date',
                'J&K 1950-till date',
                'JHARKHAND 2000-till date',
                'KARNATAKA 1949-till date',
                'KERALA 1929-till date',
                'M.P. 1916-till date',
                'MADRAS 1842-till date',
                'MANIPUR 2013-till date',
                'MEGHALAYA 2013-till date',
                'ORISSA 1918-till date',
                'PATNA 1916-till date',
                'PUNJAB & HARYANA 1905-till date',
                'RAJASTHAN 1948-till date',
                'SIKKIM 1977-till date',
                'TELANGANA (Hyderabad) 1932-till date',
                'TRIPURA 2013-till date',
                'UTTARAKHAND (2000-till date)'
              ]
            },
            {
              title: 'HISTORICAL COURTS JUDGMENTS',
              items: ['SINCE 1901']
            },
            {
              title: 'PRIVY COUNCIL JUDGMENTS',
              items: ['SINCE 1914']
            },
            {
              title: 'TRIBUNALS',
              items: [
                'Electricity Tribunal',
                'Arbitration Tribunal',
                'Armed Forces Tribunal',
                'Authority for Advance Rulings',
                'Central Administrative Tribunal',
                'Central Information Commission',
                'Competition Commission of India',
                'Consumer Dispute Redressal Commission',
                'Customs Excise and Service Tax Appellate Tribunal',
                'Debt Recovery Appellate Tribunal',
                'Election Tribunal',
                'Foreign Exchange Tribunal',
                'Income Tax Appellate Tribunal',
                'Industrial Tribunal',
                'Labour Appellate Tribunal',
                'National Company Law Appellate Tribunal (NCLAT)',
                'National Green Tribunal',
                'NCDRC & State Commissions (Consumer Disputes)',
                'Securities Appellate Tribunal',
                'Telecom Disputes Settlement and Appellate Tribunal'
              ]
            }
          ]
        }
      }
    },
    {
      icon: 'bx-link-external',
      title: 'Cross-Citation of More than 300 Journals',
      subtitle: 'Extensive cross-referencing across major legal publications and journals for comprehensive research',
      description: 'Comprehensive citation network connecting legal precedents across multiple journals.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-news',
      title: 'Central & State Statutes',
      subtitle: 'Complete collection of central and state legislation with historical and current versions',
      description: 'Access to all current and historical statutes from central and state governments.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-edit-alt',
      title: 'Scholarly Articles & Blogs',
      subtitle: 'Expert analysis and commentary from legal scholars and practitioners across various domains',
      description: 'Curated collection of academic articles and professional insights.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-refresh',
      title: 'Latest Amendments & Updates',
      subtitle: 'Real-time updates on legal changes and amendments to keep you informed and compliant',
      description: 'Stay current with the latest changes in law and legal procedures.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-news',
      title: 'Legal News & Insights',
      subtitle: 'Current legal developments and market insights from trusted sources and expert analysis',
      description: 'Breaking legal news and expert analysis of current legal trends.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-clipboard',
      title: 'Drafting Templates & Materials',
      subtitle: 'Ready-to-use legal document templates and drafting resources for efficient legal practice',
      description: 'Professional templates and materials for efficient legal document preparation.',
      hasDetailedContent: false
    },
    {
      icon: 'bx-book-content',
      title: 'Commission & Committee Reports',
      subtitle: 'Official reports from legal commissions and committees with detailed analysis and recommendations',
      description: 'Access to important reports and recommendations from legal bodies.',
      hasDetailedContent: false
    }
  ];

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

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
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
      <section id="services" className="container pb-4 mb-md-2 mb-lg-4" ref={servicesRef}>
        <div className="row">
          <div className="col-lg-4 text-center text-lg-start pb-3 pb-lg-0 mb-3 mb-lg-0">
            <h2 className="h1 mb-3">Highly Innovative Technology & Services</h2>
            <p className="pb-3 mb-0 mb-lg-2">
              GoJuris provides cutting-edge legal research tools powered by artificial intelligence. 
              Our comprehensive database and advanced search capabilities empower legal professionals 
              with instant access to relevant case law, statutes, and legal insights, revolutionizing 
              the way legal research is conducted.
            </p>
            <a href="#" className="btn btn-primary shadow-primary btn-lg">All services</a>
          </div>
          
          <div className="col-xl-7 col-lg-8 offset-xl-1">
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {services.map((service, index) => (
                <div key={index} className="col">
                  <div className="card card-hover bg-secondary border-0 h-100">
                    <div className="card-body d-flex align-items-start p-3">
                      <div className="flex-shrink-0 bg-light rounded-3 p-2 d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                        <i className={`bx ${service.icon} text-primary`} style={{fontSize: '24px'}}></i>
                      </div>
                      <div className="d-flex flex-column h-100 flex-grow-1">
                        <h3 className="h6 mb-2 fw-semibold">{service.title}</h3>
                        <p className="text-muted mb-2 small" style={{fontSize: '0.85rem', lineHeight: '1.3'}}>{service.subtitle}</p>
                        <p className="mb-2 small">{service.description}</p>
                        <button 
                          onClick={() => openModal(index)}
                          className="btn btn-link px-0 text-decoration-none mt-auto align-self-start small"
                        >
                          Read more
                          <i className="bx bx-right-arrow-alt ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeModal !== null && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '9999' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" style={{ marginTop: '100px', maxHeight: 'calc(100vh - 120px)' }}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 bg-light rounded-3 p-3 d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <i className={`bx ${services[activeModal].icon} text-primary`} style={{fontSize: '24px'}}></i>
                  </div>
                  <h4 className="modal-title mb-0">{services[activeModal].title}</h4>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body pt-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {services[activeModal].hasDetailedContent ? (
                  <div>
                    <p className="text-muted mb-4">{services[activeModal].subtitle}</p>
                    {services[activeModal].modalContent.content.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-4">
                        <h5 className="text-primary mb-3">{section.title}</h5>
                        <div className="row">
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="col-md-6 mb-2">
                              <div className="d-flex align-items-start">
                                <i className="bx bx-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                                <span style={{fontSize: '0.9rem'}}>{item}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bx bx-time-five text-muted mb-3" style={{fontSize: '3rem'}}></i>
                    <h4 className="text-muted mb-3">Coming Soon</h4>
                    <p className="text-muted">This feature is currently under development and will be available soon.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={closeModal}
                >
                  Close
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
          style={{ zIndex: 9998 }}
          onClick={closeModal}
        ></div>
      )}
    </>
  );
};

export default Services;