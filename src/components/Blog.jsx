// src/components/Blog.jsx
import React from 'react';

const Blog = () => {
  const blogPosts = [
    {
      title: 'Understanding COVID-19 Vaccination: What You Need to Know',
      excerpt: 'Complete guide to COVID-19 vaccines, their effectiveness, and safety measures.',
      author: 'Dr. Sarah Wilson',
      date: 'March 15, 2024',
      readTime: '5 min read',
      category: 'Prevention',
      image: 'bg-primary'
    },
    {
      title: 'Heart Health: 10 Simple Steps to Keep Your Heart Strong',
      excerpt: 'Learn practical tips and lifestyle changes to maintain cardiovascular health.',
      author: 'Dr. Michael Johnson',
      date: 'March 12, 2024',
      readTime: '8 min read',
      category: 'Cardiology',
      image: 'bg-danger'
    },
    {
      title: 'Mental Health Awareness: Breaking the Stigma',
      excerpt: 'Understanding mental health issues and how to seek help when needed.',
      author: 'Dr. Emily Chen',
      date: 'March 10, 2024',
      readTime: '6 min read',
      category: 'Mental Health',
      image: 'bg-success'
    }
  ];

  return (
    <section className="container py-5 mb-md-3 mb-lg-5">
      <div className="d-md-flex align-items-center justify-content-between text-center text-md-start mb-5">
        <div>
          <h2 className="h1 mb-md-0">Latest News </h2>
          <p className="text-muted mb-0">Stay updated with the latest health information and medical insights</p>
        </div>
        <a href="#" className="btn btn-outline-primary">
          View All Articles
          <i className="bx bx-right-arrow-alt fs-xl ms-2 me-n1"></i>
        </a>
      </div>
      
      <div className="row g-4">
        {blogPosts.map((post, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <article className="card card-hover border-0 shadow-sm h-100">
              <div className={`${post.image} rounded-top d-flex align-items-center justify-content-center text-white`}
                   style={{ height: '200px' }}>
                <div className="text-center">
                  <i className="bx bx-news display-4 mb-2"></i>
                  <div className="badge bg-white text-dark rounded-pill px-3 py-1">
                    {post.category}
                  </div>
                </div>
              </div>
              
              <div className="card-body p-4">
                <h3 className="h5 mb-3">
                  <a href="#" className="text-decoration-none text-dark stretched-link">
                    {post.title}
                  </a>
                </h3>
                <p className="text-muted mb-3">{post.excerpt}</p>
                
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                         style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                      {post.author.split(' ').map(name => name.charAt(0)).join('')}
                    </div>
                    <div>
                      <small className="text-dark fw-medium d-block">{post.author}</small>
                      <small className="text-muted">{post.date}</small>
                    </div>
                  </div>
                  <small className="text-muted">{post.readTime}</small>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;