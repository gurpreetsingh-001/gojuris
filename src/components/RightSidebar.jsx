// components/RightSidebar.jsx - Vertical slide-in for mobile
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/apiService';
var isGJ = false;
const RightSidebar = ({judgmentData} ) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [navigationData, setNavigationData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAddBoomkarkModal, setShowAddBoomkarkModal] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
     const domain = window.location.hostname;

    if (domain.includes("gojuris.ai")) {
      isGJ = true;
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedNavData = sessionStorage.getItem('judgementNavigation');
    if (savedNavData) {
      try {
        const navData = JSON.parse(savedNavData);
        setNavigationData(navData);
        
        const index = navData.results.findIndex(result => result.keycode === id);
        setCurrentIndex(index);
      } catch (error) {
        console.error('Failed to parse navigation data:', error);
      }
    }
  }, [id]);

  const handleNavigation = (direction) => {
    if (!navigationData || currentIndex === -1) return;

    let newIndex;
    if (direction === 'previous') {
      newIndex = currentIndex - 1;
    } else if (direction === 'next') {
      newIndex = currentIndex + 1;
    }

    if (newIndex >= 0 && newIndex < navigationData.results.length) {
      const nextJudgement = navigationData.results[newIndex];
      
      const updatedNavData = {
        ...navigationData,
        currentIndex: newIndex
      };
      sessionStorage.setItem('judgementNavigation', JSON.stringify(updatedNavData));
      
      navigate(`/judgement/${nextJudgement.keycode}`);
      
      // Close sidebar on mobile after navigation
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };
  const getDisplayName = () => {
    const storedUserData = localStorage.getItem('userData');
      
     const userProfile =  JSON.parse(storedUserData);
    if (!userProfile) return '';

    return userProfile.displayName ||
      userProfile.name ||
      userProfile.username ||
      (userProfile.email ? userProfile.email.split('@')[0] : 'Legal User');
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';

    try {
      const dateStr = dateString.toString();
      if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${day}-${month}-${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };
  const printCustom = () => {
    const allHtml =judgmentData.judgement;
    const logoUrl = window.location.origin + (isGJ ? "/logo.png" : "/logoLe.png");
    const pnew= `<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <style>
        @media print {
           body {
        counter-reset: page 1;
    }
  footer {
        text-align: center !important;
        width: 100% !important;
        display: block !important;
        margin: 0 auto !important;
    }
@page {
    margin-top:10px; margin-bottom:10px;
    @bottom-right {
      content: "Page " counter(page);
      font-size: 9pt;
      margin-top: -7mm;
    }
  }
    tfoot td {
        text-align: center !important;
    }
       
    }
    
    </style>
</head>
<body>
        <table>
            <thead>
                <tr>
                    <td style="width: 400px;">
                        <a href="index.aspx" class="navbar-brand active">
                            <img id="imglogo" alt="Legal Egale Elite"   crossorigin="anonymous" style="margin-top: -5px; height: 50px;" src="${logoUrl}" /></a>
                    </td>
                    <td style="text-align: right; vertical-align: central; font-family: Cambria; font-size: 8pt;">This Application is licensed to : ${getDisplayName()}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div style="border: 1px solid;"></div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">
                        <p style="page-break-inside: avoid;">
<div style="text-align: center;">
           
            <div style="margin-top: 5px;">
              ${judgmentData.mainCitation}
            </div>
            <div style="margin-top: 5px;">
             <strong> IN THE ${judgmentData.court?.toUpperCase()} </strong>
            </div>

          
            <div style="margin-top: 5px;">
              Equivalent Citations : ${judgmentData.fullequivicit}
            </div>

            
            <div style="margin-top: 5px;">
              <strong>[Before : ${judgmentData.judges || ''}]</strong>
            </div>

           
            <div style="margin-top: 5px;">
              <div className="appellant-name">
                <strong>${judgmentData.appellant || ''}</strong>
              </div>
              <div style="margin-top: 5px;">vs.</div>
              <div style="margin-top: 5px;">
                <strong>${judgmentData.respondent || ''}</strong>
              </div>
            </div>

            
            <div style="margin-top: 5px;">
              Case No. : ${judgmentData.caseNo || '.'}
            </div>
            <div style="margin-top: 5px;">
              Date of Decision : ${formatDate(judgmentData.date)}
            </div>
          </div>

                       <div style="text-align: center;margin-top: 5px;"><strong>ISSUE FOR CONSIDERATION</strong></div>
              <div style="text-align: justify;margin-top: 5px;"> ${judgmentData.issueForConsideration }</div>
              <div style="text-align: center;margin-top: 5px;"><strong>LAW POINTS</strong></div>
              <div style="text-align: justify;margin-top: 5px;"> ${judgmentData.lawPoint }</div>
                        <div  style="text-align: center;margin-top: 5px;"><strong>HEADNOTE/S</strong></div>
                         <div style="text-align: justify;margin-top: 5px;">
                  <strong> ${judgmentData.newHeadnote}</strong>
                </div>
                <div style="text-align: justify;margin-top: 5px;">
                  <em><strong>Held: </strong></em> <spam >${judgmentData.held }</spam>
                </div>
                <div style="text-align: justify;margin-top: 5px;">
                  <em><strong>Background Facts: </strong></em><spam >${judgmentData.backgroundFacts }</spam>
                </div>
                 <div style="text-align: justify;margin-top: 5px;">
                <em><strong>Parties Contentions:</strong></em><spam >${judgmentData.partiesContentions }</spam>
              </div>
              <div style="text-align: justify;margin-top: 5px;">
                <em><strong>Disposition: </strong></em><spam >${judgmentData.disposition }</spam>
              </div>
               <div style="text-align: center;margin-top: 5px;"><strong>${judgmentData.headnote.length > 5 ? 'Case Notes & Summaries' : ''}</strong></div>
                <div className="headnote-content">
                  <strong>${judgmentData.headnote.length > 5 ? judgmentData.headnote : ''}</strong>
                </div>
                <div style="margin-top: 5px;font-size: 9pt;"><strong>Advocates Appeared :</strong></div>
              <div style="text-align: justify;margin-top: 5px;font-size: 9pt;"> ${judgmentData.advocates }</div>
              <div style="margin-top: 5px;font-size: 9pt;"><strong>Cases Referred :</strong></div>
              <div style="text-align: justify;margin-top: 5px;font-size: 9pt;"> ${judgmentData.actReferred }</div>
               <div style="margin-top: 5px;font-size: 9pt;"><strong>Statutes Referred :</strong></div>
              <div style="text-align: justify;margin-top: 5px;font-size: 9pt;"> ${judgmentData.casesReferred }</div>
                 <div style="text-align: center;margin-top: 10px;"><strong>JUDGMENT ORDER :</strong></div>
                            <div id="myDiv" style="text-align: justify; margin-top: 10px;">
                            ${allHtml}
                            </div>
                        </p>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2">
                        <div style="border: 1px solid;"></div>
                        <br />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center; border: 0px;">
                        <footer style="text-align: center;border-bottom: none;font-family: Cambria;font-size: 9pt;">
                           © 2025-2026 | All Rights Reserved with Capital Law Infotech, Delhi (India)
                            <span class="page-number"></span>
                        </footer>

                    </td>
                </tr>


            </tfoot>
        </table>
</body>
</html>`
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pnew);
    printWindow.document.close();
    if(window.innerWidth <= 768) {
      printWindow.print();
    }
    else {
      printWindow.onload = () => {
        printWindow.print();
      }
    }
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  }
  const handleAction = (action) => {
    switch (action) {
      case 'previous':
        handleNavigation('previous');
        break;
      case 'next':
        handleNavigation('next');
        break;
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      case 'expand':
        console.log('Expand content');
        break;
      case 'print':
        printCustom();
        break;
      case 'bookmark':
        setShowAddBoomkarkModal(true);
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Legal Judgment',
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
        break;
      case 'scroll-up':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'download':
        console.log('Download judgment');
        break;
      default:
        console.log('Action not implemented:', action);
    }
    
    // Close sidebar on mobile after action (except fullscreen)
    if (isMobile && action !== 'fullscreen') {
      setIsOpen(false);
    }
  };

  const handleAddBookmark = async (e) => {
     e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      const bookmarkData = {
        UserId : 'ok',
        appelantRespondant: judgmentData.appellant + ' Vs. ' + judgmentData.respondent,
        highlightLink: judgmentData.id,
        jDate: judgmentData.date,
        bokmarkName: bookmarkName
      };

      console.log('🚀 Attempting add bookmark...');
      debugger;
      const result = await ApiService.addBookmark(bookmarkData);

      alert(result);

    } catch (error) {
      console.error('❌ error:', error);
      alert(error);
    } finally {
      setIsLoading(false);
      setShowAddBoomkarkModal(false);
    }
    
  }

  const canGoPrevious = navigationData && currentIndex > 0;
  const canGoNext = navigationData && currentIndex < navigationData.results.length - 1;

  const sidebarActions = [
    { 
      icon: 'bx-chevron-right', 
      action: 'next', 
      title: 'Next Judgment',
      disabled: !canGoNext
    },
    { 
      icon: 'bx-chevron-left', 
      action: 'previous', 
      title: 'Previous Judgment',
      disabled: !canGoPrevious
    },
    { icon: 'bx-fullscreen', action: 'fullscreen', title: 'Fullscreen' },
    { icon: 'bx-expand-alt', action: 'expand', title: 'Expand' },
    { icon: 'bx-printer', action: 'print', title: 'Print' },
    { icon: 'bx-bookmark', action: 'bookmark', title: 'Bookmark' },
    { icon: 'bx-copy', action: 'copy', title: 'Copy Link' },
    { icon: 'bx-share-alt', action: 'share', title: 'Share' },
    { icon: 'bx-up-arrow-alt', action: 'scroll-up', title: 'Scroll to Top' },
    { icon: 'bx-download', action: 'download', title: 'Download' }
  ];

  return (
    <>
      {/* Floating Toggle Button - Mobile Only */}
      {isMobile && (
        <button
          className={`floating-toggle-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          <i className={`bx ${isOpen ? 'bx-x' : 'bx-dots-vertical-rounded'}`}></i>
        </button>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`right-sidebar ${isMobile && isOpen ? 'mobile-open' : ''} ${isMobile && !isOpen ? 'mobile-closed' : ''}`}>
        <div className="right-sidebar-content">
          {sidebarActions.map((item, index) => (
            <button
              key={index}
              className={`right-sidebar-btn ${item.disabled ? 'disabled' : ''}`}
              onClick={() => !item.disabled &&  handleAction(item.action)}
              title={item.title}
              disabled={item.disabled}
            >
              <i className={`bx ${item.icon}`}></i>
            </button>
          ))}
        </div>
      </div>
      {showAddBoomkarkModal && (
                  <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={() => setShowAddBoomkarkModal(false)}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content" style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                      }}>
                        <div className="modal-header border-0">
                          <h5 className="modal-title" style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a'
                          }}>
                           Add To Bookmark
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowAddBoomkarkModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                           <form onSubmit={handleAddBookmark}>
                          <div style={{
                            marginBottom: '16px'
                          }}>
                          
                          <label className="form-label">Enter Bookmark Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={bookmarkName}
                            onChange={(e) => setBookmarkName(e.target.value)}
                            placeholder="Enter Bookmark Name"
                            required
                          />
                         
                          </div>
                        <div className="m-2 text-center">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              minWidth: "100px",
                              borderRadius: '8px',
                              background: '#7C3AED',
                              border: 'none',
                              padding: '10px'
                            }}
                          >
                           Add
                          </button>
                        </div>
                          </form>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
      <style jsx>{`
        /* Floating Toggle Button - Mobile Only */
        .floating-toggle-btn {
          display: none;
        }

        /* Backdrop for mobile */
        .sidebar-backdrop {
          display: none;
        }

        /* Desktop & Mobile Sidebar - Same vertical style */
        .right-sidebar {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          border-radius: 8px 0 0 8px;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
          max-height: 80vh;
          overflow-y: auto;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .right-sidebar-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0;
          gap: 0.5rem;
        }

        .right-sidebar-btn {
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .right-sidebar-btn:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .right-sidebar-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .floating-toggle-btn {
            display: flex;
            position: fixed;
            right: 20px;
            bottom: 80px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 1002;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            align-items: center;
            justify-content: center;
          }

          .floating-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
          }

          .floating-toggle-btn.active {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }

          .sidebar-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .right-sidebar {
            width: 70px;
            border-radius: 12px 0 0 12px;
            max-height: 85vh;
          }

          .right-sidebar.mobile-closed {
            transform: translate(100%, -50%);
            pointer-events: none;
          }

          .right-sidebar.mobile-open {
            transform: translate(0, -50%);
            pointer-events: auto;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .right-sidebar.mobile-open ~ .sidebar-backdrop {
            opacity: 1;
            pointer-events: auto;
          }

          @keyframes slideInRight {
            from {
              transform: translate(100%, -50%);
            }
            to {
              transform: translate(0, -50%);
            }
          }

          .right-sidebar-content {
            padding: 1.2rem 0;
            gap: 0.6rem;
          }

          .right-sidebar-btn {
            width: 48px;
            height: 48px;
            font-size: 1.3rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .floating-toggle-btn {
            width: 52px;
            height: 52px;
            right: 15px;
            bottom: 70px;
            font-size: 1.4rem;
          }

          .right-sidebar {
            width: 65px;
          }

          .right-sidebar-content {
            padding: 1rem 0;
            gap: 0.5rem;
          }

          .right-sidebar-btn {
            width: 44px;
            height: 44px;
            font-size: 1.2rem;
          }
        }

        /* Scrollbar Styling */
        .right-sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .right-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .right-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .right-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default RightSidebar;








// // components/RightSidebar.jsx - Fixed import issue
// import { useState, useEffect } from 'react'; // Remove React from here
// import { useNavigate, useParams } from 'react-router-dom';

// const RightSidebar = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [navigationData, setNavigationData] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(-1);

//   useEffect(() => {
//     // Load navigation data from sessionStorage
//     const savedNavData = sessionStorage.getItem('judgementNavigation');
//     if (savedNavData) {
//       try {
//         const navData = JSON.parse(savedNavData);
//         setNavigationData(navData);
        
//         // Find current judgement index
//         const index = navData.results.findIndex(result => result.keycode === id);
//         setCurrentIndex(index);
//       } catch (error) {
//         console.error('Failed to parse navigation data:', error);
//       }
//     }
//   }, [id]);

//   const handleNavigation = (direction) => {
//     if (!navigationData || currentIndex === -1) return;

//     let newIndex;
//     if (direction === 'previous') {
//       newIndex = currentIndex - 1;
//     } else if (direction === 'next') {
//       newIndex = currentIndex + 1;
//     }

//     // Check bounds
//     if (newIndex >= 0 && newIndex < navigationData.results.length) {
//       const nextJudgement = navigationData.results[newIndex];
      
//       // Update navigation data with new index
//       const updatedNavData = {
//         ...navigationData,
//         currentIndex: newIndex
//       };
//       sessionStorage.setItem('judgementNavigation', JSON.stringify(updatedNavData));
      
//       // Navigate to new judgement
//       navigate(`/judgement/${nextJudgement.keycode}`);
//     }
//   };

//   const handleAction = (action) => {
//     switch (action) {
//       case 'previous':
//         handleNavigation('previous');
//         break;
//       case 'next':
//         handleNavigation('next');
//         break;
//       case 'fullscreen':
//         if (document.fullscreenElement) {
//           document.exitFullscreen();
//         } else {
//           document.documentElement.requestFullscreen();
//         }
//         break;
//       case 'expand':
//         console.log('Expand content');
//         break;
//       case 'print':
//         window.print();
//         break;
//       case 'bookmark':
//         console.log('Bookmark judgment');
//         break;
//       case 'copy':
//         navigator.clipboard.writeText(window.location.href);
//         break;
//       case 'share':
//         if (navigator.share) {
//           navigator.share({
//             title: 'Legal Judgment',
//             url: window.location.href
//           });
//         } else {
//           navigator.clipboard.writeText(window.location.href);
//         }
//         break;
//       case 'scroll-up':
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//         break;
//       case 'download':
//         console.log('Download judgment');
//         break;
//       default:
//         console.log('Action not implemented:', action);
//     }
//   };

//   // Check if navigation is possible
//   const canGoPrevious = navigationData && currentIndex > 0;
//   const canGoNext = navigationData && currentIndex < navigationData.results.length - 1;

//   const sidebarActions = [
//     { 
//       icon: 'bx-chevron-right', 
//       action: 'next', 
//       title: 'Next Judgment',
//       disabled: !canGoNext
//     },
//     { 
//       icon: 'bx-chevron-left', 
//       action: 'previous', 
//       title: 'Previous Judgment',
//       disabled: !canGoPrevious
//     },
//     { icon: 'bx-fullscreen', action: 'fullscreen', title: 'Fullscreen' },
//     { icon: 'bx-expand-alt', action: 'expand', title: 'Expand' },
//     { icon: 'bx-printer', action: 'print', title: 'Print' },
//     { icon: 'bx-bookmark', action: 'bookmark', title: 'Bookmark' },
//     { icon: 'bx-copy', action: 'copy', title: 'Copy Link' },
//     { icon: 'bx-share-alt', action: 'share', title: 'Share' },
//     { icon: 'bx-up-arrow-alt', action: 'scroll-up', title: 'Scroll to Top' },
//     { icon: 'bx-download', action: 'download', title: 'Download' }
//   ];

//   return (
//     <div className="right-sidebar">
//       <div className="right-sidebar-content">
//         {sidebarActions.map((item, index) => (
//           <button
//             key={index}
//             className={`right-sidebar-btn ${item.disabled ? 'disabled' : ''}`}
//             onClick={() => !item.disabled && handleAction(item.action)}
//             title={item.title}
//             disabled={item.disabled}
//           >
//             <i className={`bx ${item.icon}`}></i>
//           </button>
//         ))}
//       </div>

//       <style jsx>{`
//         .right-sidebar {
//           position: fixed;
//           right: 0;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 60px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           z-index: 1000;
//           display: flex;
//           flex-direction: column;
//           border-radius: 8px 0 0 8px;
//           box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
//           backdrop-filter: blur(20px);
//           max-height: 80vh;
//           overflow-y: auto;
//         }

//         .right-sidebar-content {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 1rem 0;
//           gap: 0.5rem;
//         }

//         .right-sidebar-btn {
//           width: 42px;
//           height: 42px;
//           background: rgba(255, 255, 255, 0.15);
//           border: none;
//           border-radius: 8px;
//           color: white;
//           font-size: 1.2rem;
//           cursor: pointer;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .right-sidebar-btn:hover:not(.disabled) {
//           background: rgba(255, 255, 255, 0.3);
//           transform: scale(1.1);
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
//         }

//         .right-sidebar-btn.disabled {
//           opacity: 0.4;
//           cursor: not-allowed;
//           background: rgba(255, 255, 255, 0.1);
//         }

//         @media (max-width: 768px) {
//           .right-sidebar {
//             width: 50px;
//             right: 10px;
//           }

//           .right-sidebar-btn {
//             width: 36px;
//             height: 36px;
//             font-size: 1rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RightSidebar;