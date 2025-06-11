"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [showCookie, setShowCookie] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowCookie(!localStorage.getItem("cookieConsent"));
    }
  }, []);

  const acceptCookie = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookie(false);
  };

  if (!showCookie) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 w-full bg-secondary text-white px-4 py-3 flex items-center justify-between z-50 shadow-lg"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div>
        <span 
          id="cookie-banner-title" 
          className="sr-only"
        >
          Cookie Consent
        </span>
        <span id="cookie-banner-description">
          This site uses cookies for authentication and session management.
        </span>
      </div>
      <button
        className="ml-4 bg-primary text-white px-4 py-1 rounded hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary"
        onClick={acceptCookie}
        aria-label="Accept cookies and close banner"
      >
        Accept
      </button>
    </div>
  );
} 