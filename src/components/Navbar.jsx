// src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid px-3">
          {/* Brand - moved to start */}
          <div className="navbar-brand p-0">
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              style={{ height: '64px', width: 'auto' }}
            />
          </div>

          {/* Right side buttons */}
          <div className="d-flex align-items-center gap-2">
            {/* Settings Button - opens modal */}
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bx bx-cog"></i>
            </button>

            {/* My Account Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-3"
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                <i className="bx bx-user"></i>
                <span>My Account</span>
                <i className="bx bx-chevron-down"></i>
              </button>
              
              {showAccountDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '220px' }}>
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '32px', height: '32px' }}>
                        <i className="bx bx-user text-white"></i>
                      </div>
                      <div>
                        <div className="fw-semibold">John Doe</div>
                        <small className="text-muted">john@example.com</small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-user-circle me-2"></i>View Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-credit-card me-2"></i>Billing & Plans
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-history me-2"></i>Search History
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-bookmark me-2"></i>Saved Searches
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-download me-2"></i>Downloads
                  </a>
                  
                  <div className="dropdown-divider"></div>
                  
                  <a className="dropdown-item text-danger" href="#">
                    <i className="bx bx-log-out me-2"></i>Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside handler for account dropdown */}
        {showAccountDropdown && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1 }}
            onClick={() => setShowAccountDropdown(false)}
          ></div>
        )}
      </nav>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '40px', height: '40px' }}>
                    <i className="bx bx-cog text-white fs-5"></i>
                  </div>
                  <h4 className="modal-title mb-0">Settings</h4>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSettingsModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body text-center py-5">
                <div className="mb-4">
                  <i className="bx bx-time-five text-muted" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="text-muted mb-3">Coming Soon</h3>
                <p className="text-muted mb-0">
                  Settings panel is currently under development and will be available soon with advanced customization options.
                </p>
              </div>
              
              <div className="modal-footer border-0 justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-primary px-4"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal Backdrop */}
      {showSettingsModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 9998 }}
          onClick={() => setShowSettingsModal(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;