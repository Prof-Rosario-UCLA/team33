import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import CookieBanner from './components/CookieBanner';
import OfflineBanner from './components/OfflineBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pantrify',
  description: 'Manage your pantry, discover recipes, and never waste food again',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-background text-gray-900'}>
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        <OfflineBanner />
        
        <nav 
          className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-2xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded"
              aria-label="Pantrify home"
            >
              Pantrify
            </Link>
            <Link 
              href="/pantry" 
              className="ml-6 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"
            >
              Pantry
            </Link>
            <Link 
              href="/recipes" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"
            >
              Recipes
            </Link>
            <Link 
              href="/scan" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"
            >
              AI Scan
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"
            >
              Profile
            </Link>
          </div>
        </nav>
        
        <main 
          id="main-content" 
          className="min-h-screen bg-background"
          role="main"
        >
          {children}
        </main>
        
        <CookieBanner />
      </body>
    </html>
  );
}
