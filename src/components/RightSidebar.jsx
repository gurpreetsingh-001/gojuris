// components/RightSidebar.jsx - Fixed import issue
import { useState, useEffect } from 'react'; // Remove React from here
import { useNavigate, useParams } from 'react-router-dom';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [navigationData, setNavigationData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // Load navigation data from sessionStorage
    const savedNavData = sessionStorage.getItem('judgementNavigation');
    if (savedNavData) {
      try {
        const navData = JSON.parse(savedNavData);
        setNavigationData(navData);
        
        // Find current judgement index
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

    // Check bounds
    if (newIndex >= 0 && newIndex < navigationData.results.length) {
      const nextJudgement = navigationData.results[newIndex];
      
      // Update navigation data with new index
      const updatedNavData = {
        ...navigationData,
        currentIndex: newIndex
      };
      sessionStorage.setItem('judgementNavigation', JSON.stringify(updatedNavData));
      
      // Navigate to new judgement
      navigate(`/judgement/${nextJudgement.keycode}`);
    }
  };

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
        window.print();
        break;
      case 'bookmark':
        console.log('Bookmark judgment');
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
  };

  // Check if navigation is possible
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
    <div className="right-sidebar">
      <div className="right-sidebar-content">
        {sidebarActions.map((item, index) => (
          <button
            key={index}
            className={`right-sidebar-btn ${item.disabled ? 'disabled' : ''}`}
            onClick={() => !item.disabled && handleAction(item.action)}
            title={item.title}
            disabled={item.disabled}
          >
            <i className={`bx ${item.icon}`}></i>
          </button>
        ))}
      </div>

      <style jsx>{`
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

        @media (max-width: 768px) {
          .right-sidebar {
            width: 50px;
            right: 10px;
          }

          .right-sidebar-btn {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RightSidebar;