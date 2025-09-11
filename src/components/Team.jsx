// src/components/Team.jsx
import React, { useEffect, useRef } from 'react';

const Team = () => {
  const teamRef = useRef(null);

  const doctors = [
    {
      name: 'Dr. Ronald Richards',
      specialty: 'Neurosurgeon',
      color: 'bg-primary'
    },
    {
      name: 'Dr. Esther Howard',
      specialty: 'Therapist',
      color: 'bg-success'
    },
    {
      name: 'Dr. Jerome Bell',
      specialty: 'Anesthesiologist',
      color: 'bg-info'
    },
    {
      name: 'Dr. Ralph Edwards',
      specialty: 'Surgeon',
      color: 'bg-warning'
    },
    {
      name: 'Dr. Darrell Steward',
      specialty: 'Cardiologist',
      color: 'bg-danger'
    },
    {
      name: 'Dr. Annette Black',
      specialty: 'Pediatrician',
      color: 'bg-secondary'
    },
    {
      name: 'Dr. Dianne Russell',
      specialty: 'Dentist',
      color: 'bg-dark'
    },
    {
      name: 'Dr. Courtney Henry',
      specialty: 'Gynecologist',
      color: 'bg-purple'
    }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.team-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-in');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (teamRef.current) {
      observer.observe(teamRef.current);
    }

    return () => {
      if (teamRef.current) {
        observer.unobserve(teamRef.current);
      }
    };
  }, []);

  return (
    <section id="doctors" className="container pt-xl-2 pb-5 mb-md-3 mb-lg-5" ref={teamRef}>
      <div className="d-md-flex align-items-center justify-content-between text-center text-md-start pb-1 pb-lg-0 mb-4 mb-lg-5">
        <h2 className="h1 mb-md-0">Team Gojuris- Meet the Minds behind Gojuris</h2>
        <a href="#" className="btn btn-outline-primary">
          See all doctors
          <i className="bx bx-right-arrow-alt fs-xl ms-2 me-n1"></i>
        </a>
      </div>
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {doctors.map((doctor, index) => (
          <div key={index} className="col">
            <div className="card card-hover border-0 bg-transparent team-card">
              <div className="position-relative">
                <div 
                  className={`${doctor.color} rounded-3 d-flex align-items-center justify-content-center text-white position-relative overflow-hidden float`}
                  style={{height: '300px', fontSize: '3rem', fontWeight: 'bold'}}
                >
                  {getInitials(doctor.name)}
                  
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 opacity-0 card-overlay">
                    <div className="d-flex gap-2">
                      <a href="#" className="btn btn-icon btn-sm bg-white text-dark rounded-circle icon-bounce" aria-label="Facebook">
                        <i className="bx bxl-facebook"></i>
                      </a>
                      <a href="#" className="btn btn-icon btn-sm bg-white text-dark rounded-circle icon-bounce" aria-label="LinkedIn">
                        <i className="bx bxl-linkedin"></i>
                      </a>
                      <a href="#" className="btn btn-icon btn-sm bg-white text-dark rounded-circle icon-bounce" aria-label="Twitter">
                        <i className="bx bxl-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body text-center p-3">
                <h3 className="fs-lg fw-semibold pt-1 mb-2">{doctor.name}</h3>
                <p className="fs-sm text-muted mb-0">{doctor.specialty}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;