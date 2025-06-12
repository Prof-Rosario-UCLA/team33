import { FaUserCircle, FaSignOutAlt, FaHeart } from "react-icons/fa";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <FaUserCircle className="text-6xl text-primary mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Your Profile</h1>
        <p className="text-gray-700 mb-4 text-center">Manage your account, view saved recipes, and sign out.</p>
        <button className="bg-alert text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center gap-2">
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
      <div className="bg-accent/20 rounded-lg p-6 w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-primary mb-2 flex items-center gap-2"><FaHeart className="text-secondary" /> Saved Recipes</h2>
        <p className="text-gray-700 text-center">You haven&apos;t saved any recipes yet.</p>
      </div>
    </div>
  );
} 