import React, { useEffect, useRef, useState } from 'react';

const GoogleTranslate = () => {
  const translateRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId;

    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate && translateRef.current) {
        // Clear any existing translate element
        translateRef.current.innerHTML = '';
        
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'hi,bn,te,ta,gu,kn,ml,mr,pa,or,as,ur,ne,si,my,th,vi,zh,ja,ko,fr,de,es,it,pt,ru,ar',
            layout: window.google.translate.TranslateElement.InlineLayout.DROPDOWN,
            autoDisplay: false,
            multilanguagePage: true
          }, translateRef.current);
          
          setIsLoaded(true);
        } catch (error) {
          console.error('Google Translate initialization error:', error);
          // Retry after a delay
          timeoutId = setTimeout(initializeGoogleTranslate, 1000);
        }
      } else {
        // Retry if Google Translate is not ready
        timeoutId = setTimeout(initializeGoogleTranslate, 500);
      }
    };

    // Load Google Translate script if not already loaded
    if (!window.google || !window.google.translate) {
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        
        window.googleTranslateElementInit = () => {
          initializeGoogleTranslate();
        };
        
        document.head.appendChild(script);
      } else {
        // Script exists, try to initialize
        window.googleTranslateElementInit = () => {
          initializeGoogleTranslate();
        };
        initializeGoogleTranslate();
      }
    } else {
      // Google Translate is already loaded
      initializeGoogleTranslate();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="google-translate-container">
      <div className="translate-label">
        <i className="bx bx-world" style={{ marginRight: '5px' }}></i>
        Language:
      </div>
      <div 
        ref={translateRef}
        id="google_translate_element"
        style={{ minHeight: '35px' }}
      >
        {!isLoaded && (
          <div style={{ 
            padding: '8px 12px', 
            color: '#666', 
            fontSize: '14px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            background: '#f8f9fa'
          }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;