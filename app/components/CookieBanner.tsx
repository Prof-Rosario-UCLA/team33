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
    <div className="fixed bottom-0 left-0 w-full bg-secondary text-white px-4 py-3 flex items-center justify-between z-50 shadow-lg">
      <span>This site uses cookies for authentication and session management. </span>
      <button
        className="ml-4 bg-primary text-white px-4 py-1 rounded hover:bg-accent transition-colors"
        onClick={acceptCookie}
      >
        Accept
      </button>
    </div>
  );
} 