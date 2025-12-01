// src/components/Blog.jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/apiService';

const NewsJudgement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const payload = {
        requests: [{
          mainkeys: ['ALL'],
        }],
        sortBy: 'year',
        sortOrder: 'desc',
        page: 1,
        pageSize: 6,
        inst: '',
        prompt: "Advance",
      };
      const apiResponse = await ApiService.getLawPoints(
        payload
      );
      setBlogPosts(apiResponse.hits || []);
    }
    fetchData();
  }, []);
  const formatDate = (dateStr) => {
    if (dateStr) {
      try {
        if (dateStr.length === 8) {
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${day}/${month}/${year}`;
        }
        return dateStr;
      } catch {
        return dateStr;
      }
    }
    return 'Date not available';
  };

  return (
    <section id="llp" className="container mb-md-3 pt-4">
      <div className="d-md-flex align-items-center justify-content-between text-center text-md-start mb-5">
        <div>
          <h2 className="h1 mb-md-0">Latest Law Points </h2>
          <p className="text-muted mb-0">Stay updated with the latest law points</p>
        </div>
        <a href="/latest-Lawpoints" className="btn btn-outline-primary">
          View All Law Points
          <i className="bx bx-right-arrow-alt fs-xl ms-2 me-n1"></i>
        </a>
      </div>

      <div className="row g-4">
        {blogPosts.map((post, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <article className="card card-hover border-0 shadow-lg h-100">

              <div className="card-body p-4">
                <h3 className="h5 mb-3">
                  <a href="#" className="text-decoration-none text-dark stretched-link">
                    {post.lawPoint}
                  </a>
                </h3>
                <p className="text-muted mb-3">{post.appellant} Vs. {post.respondent} </p>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">

                    <div>
                      <small className="text-dark fw-medium d-block">{post.author}</small>
                      <small className="text-muted">{formatDate(post.date)}</small>
                    </div>
                  </div>
                  <small className="text-muted">{post.court}</small>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsJudgement;