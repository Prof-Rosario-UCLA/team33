import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CookieBanner from './components/CookieBanner';
import OfflineBanner from './components/OfflineBanner';
import Providers from './components/Providers';

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
        <Providers>
          {/* Skip to main content link for keyboard users */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50"
          >
            Skip to main content
          </a>
          
          <OfflineBanner />
          
          <main 
            id="main-content" 
            className="min-h-screen bg-background"
            role="main"
          >
            {children}
          </main>
          
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
