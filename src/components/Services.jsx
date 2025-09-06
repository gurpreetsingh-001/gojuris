// src/components/Services.jsx
import React, { useEffect, useRef } from 'react';

const Services = () => {
  const servicesRef = useRef(null);

  const services = [
    {
      icon: 'bx-heart',
      title: 'Cardiology',
      description: 'Id mollis consectetur congue egestas egestas suspendisse blandit justo.'
    },
    {
      icon: 'bx-cut',
      title: 'Surgery',
      description: 'Mattis urna ultricies non amet, purus in auctor non. Odio vulputate ac nibh.'
    },
    {
      icon: 'bx-radiation',
      title: 'Radiology',
      description: 'Faucibus cursus maecenas lorem cursus nibh.'
    },
    {
      icon: 'bx-user-plus',
      title: 'Family Medicine',
      description: 'Augue pulvinar justo, fermentum fames aliquam.'
    },
    {
      icon: 'bx-wind',
      title: 'Pulmonary',
      description: 'Ullamcorper in magna varius quisque enim tempor iaculis proin sed.'
    },
    {
      icon: 'bx-happy',
      title: 'Dental Care',
      description: 'Faucibus cursus maecenas lorem cursus nibh.'
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

  return (
    <section id="services" className="container pb-5 mb-md-2 mb-lg-5" ref={servicesRef}>
      <div className="row">
        <div className="col-lg-4 text-center text-lg-start pb-3 pb-lg-0 mb-4 mb-lg-0">
          <h2 className="h1 mb-lg-4">Highly Innovative Technology & Services</h2>
          <p className="pb-4 mb-0 mb-lg-3">
            We appreciate your trust greatly. Our patients choose us and our services 
            because they know we are the best. We offer complete health care to individuals 
            with various health concerns.
          </p>
          <a href="#" className="btn btn-primary shadow-primary btn-lg">All services</a>
        </div>
        
        <div className="col-xl-7 col-lg-8 offset-xl-1">
          <div className="row row-cols-1 row-cols-md-2">
            {services.map((service, index) => (
              <div key={index} className="col">
                <div className="card card-hover bg-secondary border-0 mb-4">
                  <div className="card-body d-flex align-items-start">
                    <div className="flex-shrink-0 bg-light rounded-3 p-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                      <i className={`bx ${service.icon} text-primary`} style={{fontSize: '28px'}}></i>
                    </div>
                    <div className="ps-4">
                      <h3 className="h5 pb-2 mb-1">{service.title}</h3>
                      <p className="pb-2 mb-1">{service.description}</p>
                      <a href="#" className="btn btn-link stretched-link px-0 text-decoration-none">
                        Learn more
                        <i className="bx bx-right-arrow-alt fs-xl ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;