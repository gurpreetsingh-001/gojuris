// src/components/Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="bg-secondary py-5">
      <div className="container py-md-3 py-lg-5">
        <div className="row">
          <div className="col-lg-4 pb-3 pb-lg-0 mb-4 mb-lg-0">
            <h2 className="h1 mb-4">Get Free Professional Consultation</h2>
            
            <div className="d-flex align-items-start pb-3 mb-3">
              <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                <i className="bx bx-map"></i>
              </div>
              <div className="ps-1">
                <h6 className="mb-1">Address</h6>
                <p className="fs-sm text-muted mb-0">
                  Noe Valley Bakery 24th Street,<br />
                  San Francisco, CA, USA
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start pb-3 mb-3">
              <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                <i className="bx bx-phone-call"></i>
              </div>
              <div className="ps-1">
                <h6 className="mb-1">Phone</h6>
                <p className="fs-sm text-muted mb-0">(406) 555-0120</p>
              </div>
            </div>
            
            <div className="d-flex align-items-start pb-3 mb-3">
              <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                <i className="bx bx-time-five"></i>
              </div>
              <div className="ps-1">
                <h6 className="mb-1">Hours</h6>
                <ul className="list-unstyled fs-sm text-muted mb-0">
                  <li>Mon – Fri: 9:00 am – 22:00 pm</li>
                  <li>Sat – Sun: 9:00 am – 20:00 pm</li>
                </ul>
              </div>
            </div>
            
            <div className="d-flex align-items-start">
              <div className="btn btn-icon btn-outline-primary btn-sm pe-none flex-shrink-0 me-3">
                <i className="bx bx-envelope"></i>
              </div>
              <div className="ps-1">
                <h6 className="mb-1">Email</h6>
                <p className="fs-sm text-muted mb-0">example@email.com</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-sm-6">
                      <label className="form-label fw-medium" htmlFor="service">Service</label>
                      <select
                        className="form-select"
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a service</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="surgery">Surgery</option>
                        <option value="radiology">Radiology</option>
                        <option value="family-medicine">Family Medicine</option>
                        <option value="pulmonary">Pulmonary</option>
                        <option value="dental-care">Dental Care</option>
                      </select>
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-medium" htmlFor="message">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Make an appointment
                        <i className="bx bx-right-arrow-alt lh-1 fs-4 ms-2"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;