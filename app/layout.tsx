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
        <OfflineBanner />
        <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Pantrify
            </Link>
            <Link href="/pantry" className="ml-6 hover:text-accent transition-colors">
              Pantry
            </Link>
            <Link href="/recipes" className="hover:text-accent transition-colors">
              Recipes
            </Link>
            <Link href="/scan" className="hover:text-accent transition-colors">
              AI Scan
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="hover:text-accent transition-colors">
              Profile
            </Link>
          </div>
        </nav>
        <main className="min-h-screen bg-background">{children}</main>
        <CookieBanner />
      </body>
    </html>
  );
}
