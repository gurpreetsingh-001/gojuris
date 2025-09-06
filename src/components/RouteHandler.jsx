// src/components/RouteHandler.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteHandler = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Force immediate positioning to top on route change
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

export default RouteHandler;