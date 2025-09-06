// src/components/RightSidebar.jsx
import React from 'react';

const RightSidebar = () => {
  const sidebarActions = [
    { icon: 'bx-chevron-left', action: 'previous' },
    { icon: 'bx-chevron-right', action: 'next' },
    { icon: 'bx-fullscreen', action: 'fullscreen' },
    { icon: 'bx-expand-alt', action: 'expand' },
    { icon: 'bx-printer', action: 'print' },
    { icon: 'bx-bookmark', action: 'bookmark' },
    { icon: 'bx-copy', action: 'copy' },
    { icon: 'bx-share-alt', action: 'share' },
    { icon: 'bx-up-arrow-alt', action: 'scroll-up' },
    { icon: 'bx-download', action: 'download' }
  ];

  return (
    <div className="right-sidebar">
      <div className="right-sidebar-content">
        {sidebarActions.map((item, index) => (
          <button
            key={index}
            className="right-sidebar-btn"
            onClick={() => console.log(item.action)}
          >
            <i className={`bx ${item.icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;