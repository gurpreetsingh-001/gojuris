// src/components/Features.jsx
import React, { useEffect, useRef } from 'react';

const Features = () => {
  const featuresRef = useRef(null);

  const features = [
    {
      icon: 'bx-user-voice',
      title: 'Find a Doctor',
      description: 'Search the right doctor by location and specialty.',
      linkText: 'See all doctors',
      link: '#doctors',
      bgColor: 'bg-primary'
    },
    {
      icon: 'bx-plus-medical',
      title: 'Emergency Service',
      description: 'Call us 24/7 at (406) 555-0120',
      linkText: 'Contact us',
      link: 'tel:4065550120',
      bgColor: 'bg-danger'
    },
    {
      icon: 'bx-shield-quarter',
      title: 'COVID-19 Info',
      description: 'We offer quick COVID-19 testing by appointment.',
      linkText: 'Learn more',
      link: '#services',
      bgColor: 'bg-warning'
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

  const handleFeatureClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.startsWith('tel:')) {
      window.location.href = link;
    }
  };

  return (
    <section className="container py-5 mb-2 mb-md-4 mb-lg-5" ref={featuresRef}>
      <div className="row row-cols-1 row-cols-md-3 g-4 pt-2 pt-md-4 pb-lg-2">
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
                  onClick={() => handleFeatureClick(feature.link)}
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
  );
};

export default Features;