// src/components/RightSidebar.jsx - Enhanced with functional actions
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RightSidebar = () => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    switch (action) {
      case 'previous':
        console.log('Navigate to previous judgment');
        // TODO: Implement previous judgment navigation
        break;
      case 'next':
        console.log('Navigate to next judgment');
        // TODO: Implement next judgment navigation
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
        // TODO: Implement content expansion
        break;
      case 'print':
        window.print();
        break;
      case 'bookmark':
        console.log('Bookmark judgment');
        // TODO: Implement bookmark functionality
        break;
      case 'copy':
        // Copy current URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        console.log('URL copied to clipboard');
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Legal Judgment',
            url: window.location.href
          });
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          console.log('URL copied for sharing');
        }
        break;
      case 'scroll-up':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'download':
        console.log('Download judgment');
        // TODO: Implement download functionality
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const sidebarActions = [
    { icon: 'bx-chevron-left', action: 'previous', title: 'Previous Judgment' },
    { icon: 'bx-chevron-right', action: 'next', title: 'Next Judgment' },
    { icon: 'bx-fullscreen', action: 'fullscreen', title: 'Toggle Fullscreen' },
    { icon: 'bx-expand-alt', action: 'expand', title: 'Expand Content' },
    { icon: 'bx-printer', action: 'print', title: 'Print Judgment' },
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
            className="right-sidebar-btn"
            onClick={() => handleAction(item.action)}
            title={item.title}
          >
            <i className={`bx ${item.icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;