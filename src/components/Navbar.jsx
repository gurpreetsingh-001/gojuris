// src/components/Navbar.jsx - Added Back to Dashboard button
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/apiService';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      
      // First, try to get user data from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const storedUserData = localStorage.getItem('userData');
      
      let profileData = null;

      // Try to parse stored user data
      if (storedUserData) {
        try {
          profileData = JSON.parse(storedUserData);
        } catch (e) {
          console.warn('Failed to parse stored user data');
        }
      }

      // If we have basic info from localStorage, use it as fallback
      if (userEmail && !profileData) {
        profileData = {
          email: userEmail,
          username: userEmail.split('@')[0], // Extract username from email
          name: userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)
        };
      }

      // Try to fetch fresh profile from API
      try {
        const apiProfile = await ApiService.getUserInfo();
        if (apiProfile) {
          profileData = {
            ...profileData,
            ...apiProfile,
            // Ensure we have display name
            displayName: apiProfile.name || apiProfile.fullName || apiProfile.firstName 
              ? `${apiProfile.firstName || ''} ${apiProfile.lastName || ''}`.trim()
              : apiProfile.username || profileData?.username || 'Legal User'
          };
          
          // Store updated profile data
          localStorage.setItem('userData', JSON.stringify(profileData));
        }
      } catch (apiError) {
        console.warn('Failed to fetch user profile from API:', apiError.message);
        // Continue with localStorage data
      }

      setUserProfile(profileData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Set default fallback
      setUserProfile({
        email: 'user@gojuris.com',
        displayName: 'Legal User',
        username: 'user'
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await ApiService.logout();
      // Clear all local storage
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force logout even if API call fails
      localStorage.clear();
      navigate('/login');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile) return 'U';
    
    const displayName = userProfile.displayName || userProfile.name || userProfile.username;
    if (displayName && displayName.length > 0) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    return userProfile.email ? userProfile.email[0].toUpperCase() : 'U';
  };

  // Format display name
  const getDisplayName = () => {
    if (!userProfile) return 'Loading...';
    
    return userProfile.displayName || 
           userProfile.name || 
           userProfile.username || 
           (userProfile.email ? userProfile.email.split('@')[0] : 'Legal User');
  };

  // Get email
  const getEmail = () => {
    return userProfile?.email || 'user@gojuris.com';
  };

  // Check if we're on dashboard page
  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom position-relative">
        <div className="container-fluid px-3">
          {/* Left side - Logo and Back to Dashboard button */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/dashboard" className="navbar-brand p-0 m-0">
              <img 
                src="/logo.png" 
                alt="GoJuris Logo" 
                style={{ height: '64px', width: 'auto' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <span style="color: var(--gj-primary); font-size: 1.5rem; font-weight: 700;">
                      GoJuris<span style="color: var(--gj-secondary);">AI</span>
                    </span>
                  `;
                }}
              />
            </Link>

            {/* Back to Dashboard button - only show when NOT on dashboard */}
            {!isOnDashboard && (
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2 px-3"
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                <i className="bx bx-home-alt"></i>
                <span>Back to Dashboard</span>
              </button>
            )}
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

            {/* My Account Dropdown - Fixed positioning */}
            <div className="position-relative">
              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-3"
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? (
                  <>
                    <i className="bx bx-loader bx-spin"></i>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-user"></i>
                    <span>My Account</span>
                  </>
                )}
                <i className="bx bx-chevron-down"></i>
              </button>
              
              {/* Fixed Dropdown with proper positioning */}
              {showAccountDropdown && !isLoadingProfile && (
                <div 
                  className="position-absolute bg-white border rounded shadow"
                  style={{ 
                    top: '100%', 
                    right: '0', 
                    minWidth: '280px', 
                    maxWidth: '320px',
                    zIndex: 1050,
                    marginTop: '0.5rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}
                >
                  {/* User Info Header */}
                  <div className="px-3 py-3 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold flex-shrink-0" 
                           style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {getUserInitials()}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-semibold text-truncate" 
                             style={{ fontSize: '14px' }}
                             title={getDisplayName()}>
                          {getDisplayName()}
                        </div>
                        <small className="text-muted text-truncate d-block" 
                               style={{ fontSize: '12px' }}
                               title={getEmail()}>
                          {getEmail()}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        console.log('View Profile clicked');
                      }}
                    >
                      <i className="bx bx-user-circle me-2 text-primary"></i>
                      <span style={{ fontSize: '14px' }}>View Profile</span>
                    </button>
                    
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        console.log('Billing & Plans clicked');
                      }}
                    >
                      <i className="bx bx-credit-card me-2 text-primary"></i>
                      <span style={{ fontSize: '14px' }}>Billing & Plans</span>
                    </button>
                    
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        console.log('Search History clicked');
                      }}
                    >
                      <i className="bx bx-history me-2 text-primary"></i>
                      <span style={{ fontSize: '14px' }}>Search History</span>
                    </button>
                    
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        console.log('Saved Searches clicked');
                      }}
                    >
                      <i className="bx bx-bookmark me-2 text-primary"></i>
                      <span style={{ fontSize: '14px' }}>Saved Searches</span>
                    </button>
                    
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        console.log('Downloads clicked');
                      }}
                    >
                      <i className="bx bx-download me-2 text-primary"></i>
                      <span style={{ fontSize: '14px' }}>Downloads</span>
                    </button>
                  </div>
                  
                  {/* Divider and Sign Out */}
                  <div className="border-top">
                    <button 
                      className="dropdown-item px-3 py-2 border-0 bg-transparent w-100 text-start d-flex align-items-center text-danger"
                      onClick={handleSignOut}
                    >
                      <i className="bx bx-log-out me-2"></i>
                      <span style={{ fontSize: '14px' }}>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Click outside handler for account dropdown */}
        {showAccountDropdown && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040 }}
            onClick={() => setShowAccountDropdown(false)}
          ></div>
        )}
      </nav>

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowSettingsModal(false)}
          ></div>
          <div 
            className="modal fade show d-block" 
            style={{ zIndex: 1060 }}
          >
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
        </>
      )}
    </>
  );
};

export default Navbar;