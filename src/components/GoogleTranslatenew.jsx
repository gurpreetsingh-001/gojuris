import { useEffect } from "react";

export default function GoogleTranslate() {
  const initializeGoogleTranslate = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,en,mr,ne,gu,pa,ur,ar,ta,kn,te,bn",
        },
        "google_translate_element"
      );
    }
  };

  useEffect(() => {
    // Cleanup any old widget/script before adding fresh
    const oldScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );
    if (oldScript) oldScript.remove();

    const el = document.getElementById("google_translate_element");
    if (el) el.innerHTML = "";

    // Create new script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    // Callback Google calls
    window.googleTranslateElementInit = () => {
      initializeGoogleTranslate();
    };
   

    document.head.appendChild(script);
    

    // Cleanup on unmount
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const el = document.getElementById("google_translate_element");
      if (el) el.innerHTML = "";
      window.googleTranslateElementInit = undefined; 
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        width: "100px",
        marginTop: "0px",
        position: "absolute",
        height: "30px",
      }}
    ></div>
  );
}
