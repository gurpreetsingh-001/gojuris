// src/pages/PricingPlans.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'BASIC',
      price: 31000,
      features: [
        'AI SEARCH',
        'CHAT BOT - Ask Unlimited Questions',
        'Chat History',
        'Generate a Draft',
        'Search Suggestions (TOPIC)',
        'Chat box in judgment page',
        'Advance Search (All Parameters)',
        'Translation in Multiple Languages',
        'Basic Searches like Citation Search, Statutes Search, Subject, Topic & Other parameters'
      ],
      database: [
        'Supreme Court & SINGLE High Court',
        'Privy Council Judgments',
        'Historical Courts',
        'Federal Courts',
        'Tribunals & Commissions',
        'Central & State Laws',
        'Latest News',
        'Latest Law Points',
        'Latest Amendments',
        'Articles',
        'Reports',
        'Original Journals True Prints',
        'Prosecution Favour Page'
      ],
      popular: false,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: 51000,
      features: [
        'All Features Included in Basic',
        'VIRTUAL CHAT ASSISTANT',
        'Create Own Digests',
        'Criminal Module (Acquittal and Conviction based searches)'
      ],
      database: [
        'Supreme Court & All High Courts',
        'Historical Courts',
        'Privy Council Judgments',
        'Federal Courts',
        'Tribunals & Commissions',
        'Central & State Laws',
        'Latest News',
        'Latest Law Points',
        'Latest Amendments',
        'Deeds & Draftings',
        'Articles',
        'Reports',
        'Original Journals True Prints',
        'Prosecution Favour Page',
        'Legal Draft Hub'
      ],
      popular: true,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
    },
    {
      id: 'pro',
      name: 'PRO',
      price: 81500,
      features: [
        'All Features Included in Basic & Premium',
        'AI Case Recommender - Intelligently suggests similar and relevant cases',
        'Graphical Representations of Referred Cases and their status',
        'LEGAL CAPSULES',
        'SMART NOTIFICATIONS',
        'NEWS PORTAL',
        'Auto Case Alert',
        'Legal Draft Hub',
        'Multiple Download/Print CART',
        'E-Books',
        'Student Text Books',
        'FAQs',
        'SuperSteno (with all sections) - for detail visit www.supersteno.com'
      ],
      database: [
        'Supreme Court & All High Courts judgments',
        'Historical Courts',
        'Privy Council Judgments',
        'Federal Courts',
        'Tribunals & Commissions',
        'Central & State Laws',
        'Latest News',
        'Latest Law Points',
        'Latest Amendments',
        'Deeds & Draftings',
        'Articles',
        'Reports',
        'Original Journals True Prints',
        'Prosecution Favour Page',
        'Legal Draft Hub',
        'International Case-Laws',
        'International Treaties',
        'Policy Documents',
        'Foreign Legislations',
        'Student Text Books',
        'E-Law Books',
        'E-Commentaries',
        'E-Bare Acts'
      ],
      popular: false,
      gradient: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #6366f1 100%)'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    console.log(`Selected plan: ${planId}`);
  };

  return (
    <div className="pricing-plans-page">
      <Header />
      
      {/* Hero Section */}
      <section className="pricing-hero py-5" style={{ 
        background: 'var(--gj-gradient-primary)',
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Choose Your Perfect Plan
              </h1>
              <p className="lead text-white opacity-90 mb-4">
                Unlock the power of AI-driven legal research with our comprehensive pricing plans designed for legal professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="pricing-cards py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {plans.map((plan, index) => (
              <div key={plan.id} className="col-lg-4 col-md-6">
                <div 
                  className={`card h-100 border-0 shadow-lg position-relative overflow-hidden ${plan.popular ? 'pricing-card-popular' : ''}`}
                  style={{
                    borderRadius: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: selectedPlan === plan.id ? 'translateY(-10px)' : 'translateY(0)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div 
                      className="position-absolute top-0 end-0 m-3 z-3"
                      style={{ zIndex: 10 }}
                    >
                      <span className="badge px-3 py-2" style={{ 
                        background: 'var(--gj-secondary)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Card Header with Gradient */}
                  <div 
                    className="card-header text-center py-4 position-relative"
                    style={{
                      background: plan.gradient,
                      border: 'none'
                    }}
                  >
                    <h3 className="text-white fw-bold mb-2">{plan.name}</h3>
                    <div className="text-white">
                      <span className="display-4 fw-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="fs-6 opacity-75">/year</span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* Features Section */}
                    <div className="mb-4">
                      <h5 className="fw-semibold mb-3" style={{ color: 'var(--gj-dark)' }}>
                        Key Features
                      </h5>
                      <ul className="list-unstyled">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-start">
                            <i className="bx bx-check-circle me-2 mt-1" style={{ color: 'var(--gj-primary)' }}></i>
                            <span className="small text-muted">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="small text-primary fw-semibold">
                            + {plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Database Access */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-2" style={{ color: 'var(--gj-dark)' }}>
                        <i className="bx bx-data me-2" style={{ color: 'var(--gj-secondary)' }}></i>
                        Database Access
                      </h6>
                      <div className="small text-muted">
                        {plan.database.slice(0, 3).map((db, idx) => (
                          <span key={idx} className="d-block mb-1">• {db}</span>
                        ))}
                        <span className="text-primary fw-semibold">
                          + {plan.database.length - 3} more databases
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`btn w-100 py-3 fw-semibold ${selectedPlan === plan.id ? 'btn-success' : 'btn-primary'}`}
                      style={{
                        background: selectedPlan === plan.id 
                          ? 'var(--gj-secondary)' 
                          : plan.gradient,
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    >
                      {selectedPlan === plan.id ? (
                        <>
                          <i className="bx bx-check me-2"></i>
                          Selected
                        </>
                      ) : (
                        'Choose Plan'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact for Custom Plans */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-8 text-center">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem' }}>
                <h4 className="mb-3" style={{ color: 'var(--gj-dark)' }}>
                  Need a Custom Solution?
                </h4>
                <p className="text-muted mb-4">
                  Looking for enterprise features, custom integrations, or special pricing? 
                  Our team is here to help you find the perfect solution for your legal practice.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn btn-outline-primary px-4">
                    <i className="bx bx-phone me-2"></i>
                    Contact Sales
                  </button>
                  <button className="btn btn-primary px-4">
                    <i className="bx bx-calendar me-2"></i>
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="feature-comparison py-5" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center mb-5" style={{ color: 'var(--gj-dark)' }}>
                Detailed Feature Comparison
              </h2>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead style={{ background: 'var(--gj-gradient-primary)' }}>
                    <tr>
                      <th className="text-white fw-semibold py-3">Features</th>
                      <th className="text-white fw-semibold py-3 text-center">BASIC</th>
                      <th className="text-white fw-semibold py-3 text-center">PREMIUM</th>
                      <th className="text-white fw-semibold py-3 text-center">PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">AI Search</td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Chat Bot</td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Virtual Chat Assistant</td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">AI Case Recommender</td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Smart Notifications</td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">SuperSteno Integration</td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-x text-muted fs-4"></i></td>
                      <td className="text-center"><i className="bx bx-check text-success fs-4"></i></td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <td className="fw-bold">Database Coverage</td>
                      <td className="text-center small">Supreme Court + 1 High Court</td>
                      <td className="text-center small">All High Courts</td>
                      <td className="text-center small">Complete Database</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-center mb-5" style={{ color: 'var(--gj-dark)' }}>
                Frequently Asked Questions
              </h2>
              
              <div className="accordion" id="pricingFAQ">
                <div className="accordion-item border-0 mb-3" style={{ borderRadius: '0.5rem' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed fw-semibold" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq1"
                      style={{ borderRadius: '0.5rem', backgroundColor: 'white' }}
                    >
                      What's included in the database access?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-muted">
                      Our database includes Supreme Court judgments, High Court judgments, historical courts, 
                      tribunals, central & state laws, latest amendments, and much more. Pro plan includes 
                      international case laws and foreign legislations.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 mb-3" style={{ borderRadius: '0.5rem' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed fw-semibold" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq2"
                      style={{ borderRadius: '0.5rem', backgroundColor: 'white' }}
                    >
                      Can I upgrade or downgrade my plan?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-muted">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected 
                      in your next billing cycle, and we'll prorate any differences.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 mb-3" style={{ borderRadius: '0.5rem' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed fw-semibold" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq3"
                      style={{ borderRadius: '0.5rem', backgroundColor: 'white' }}
                    >
                      Is there a free trial available?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-muted">
                      Yes! We offer a 14-day free trial for all plans. No credit card required to start, 
                      and you can cancel anytime during the trial period.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPlans;