// src/components/Testimonials.jsx
import React, { useState } from 'react';
var isGJ= false;
const Testimonials = () => {
  
  const domain = window.location.hostname;

  if (domain.includes("gojuris.ai")) {
    isGJ= true;
  }
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Client',
      rating: 5,
      comment: 'Excellent service and professional staff. Dr. Richards helped me recover quickly from my surgery. Highly recommend this medical center.',
      avatar: 'SJ',
      color: 'bg-primary'
    },
    {
      name: 'Michael Chen',
      role: 'Client',
      rating: 5,
      comment: 'The online consultation service is fantastic. Quick, convenient, and the doctors are very knowledgeable and caring.',
      avatar: 'MC',
      color: 'bg-success'
    },
    {
      name: 'Emily Davis',
      role: 'Client',
      rating: 5,
      comment: 'Amazing experience with the cardiology department. Dr. Howard explained everything clearly and the treatment was excellent.',
      avatar: 'ED',
      color: 'bg-info'
    },
    {
      name: 'James Wilson',
      role: 'Client',
      rating: 4,
      comment: 'Great medical center with modern facilities. The staff is friendly and the waiting time is minimal.',
      avatar: 'JW',
      color: 'bg-warning'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Client',
      rating: 5,
      comment: 'The dental care service is outstanding. Dr. Russell made my treatment comfortable and pain-free.',
      avatar: 'LR',
      color: 'bg-danger'
    },
    {
      name: 'David Brown',
      role: 'Client',
      rating: 5,
      comment: 'Professional, clean, and efficient. The emergency service saved my life. Forever grateful to this team.',
      avatar: 'DB',
      color: 'bg-dark'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bx ${index < rating ? 'bxs-star' : 'bx-star'} text-warning`}
      ></i>
    ));
  };

  return (
    <section>
      <div className="container py-md-3 ">
        <div className="text-center mb-5">
          <h2 className="h1 mb-4">Success Stories with {isGJ ? 'GoJuris' : 'Legal Eagle'}</h2>
          <p className="fs-lg text-muted">
            Don't just take our word for it. Here's what our Clients have to say about their experience.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className={`rounded-circle ${testimonial.color} d-flex align-items-center justify-content-center text-white me-3`}
                      style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="text-muted mb-0">"{testimonial.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;