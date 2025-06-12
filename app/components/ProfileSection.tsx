"use client";
import { FaUserCircle, FaSignOutAlt, FaHeart, FaSignInAlt } from "react-icons/fa";
import { useSession, signOut, signIn } from "next-auth/react";

interface ProfileSectionProps {
  onNavigate: (section: string) => void;
}

export default function ProfileSection({ onNavigate }: ProfileSectionProps) {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    signIn();
  };

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
          <FaUserCircle className="text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">Sign In Required</h1>
          <p className="text-gray-700 mb-6 text-center">Please sign in to access your profile and manage your pantry.</p>
          <button 
            onClick={handleSignIn}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <FaSignInAlt /> Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <FaUserCircle className="text-6xl text-primary mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Your Profile</h1>
        <div className="text-center mb-4">
          <p className="text-gray-700 mb-2">Welcome back!</p>
          <p className="text-gray-600 text-sm">{session.user?.email}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-alert text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
      
      <div className="bg-accent/20 rounded-lg p-6 w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
          <FaHeart className="text-secondary" /> Saved Recipes
        </h2>
        <p className="text-gray-700 text-center">You haven&apos;t saved any recipes yet.</p>
      </div>
    </div>
  );
} 