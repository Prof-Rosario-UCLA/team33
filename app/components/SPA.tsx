"use client";
import { useState } from "react";
import HomeSection from "./HomeSection";
import PantrySection from "./PantrySection";
import RecipesSection from "./RecipesSection";
import ScanSection from "./ScanSection";
import ProfileSection from "./ProfileSection";

type Section = 'home' | 'pantry' | 'recipes' | 'scan' | 'profile';

export default function SPA() {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  const handleNavigate = (section: string) => {
    setCurrentSection(section as Section);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomeSection onNavigate={handleNavigate} />;
      case 'pantry':
        return <PantrySection onNavigate={handleNavigate} />;
      case 'recipes':
        return <RecipesSection onNavigate={handleNavigate} />;
      case 'scan':
        return <ScanSection onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileSection onNavigate={handleNavigate} />;
      default:
        return <HomeSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavigate('home')}
            className="text-2xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded"
            aria-label="Pantrify home"
          >
            Pantrify
          </button>
          <button 
            onClick={() => handleNavigate('pantry')}
            className={`ml-6 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1 ${
              currentSection === 'pantry' ? 'text-accent font-semibold' : ''
            }`}
          >
            Pantry
          </button>
          <button 
            onClick={() => handleNavigate('recipes')}
            className={`hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1 ${
              currentSection === 'recipes' ? 'text-accent font-semibold' : ''
            }`}
          >
            Recipes
          </button>
          <button 
            onClick={() => handleNavigate('scan')}
            className={`hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1 ${
              currentSection === 'scan' ? 'text-accent font-semibold' : ''
            }`}
          >
            AI Scan
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavigate('profile')}
            className={`hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1 ${
              currentSection === 'profile' ? 'text-accent font-semibold' : ''
            }`}
          >
            Profile
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {renderSection()}
      </main>
    </div>
  );
} 