import { FaCamera, FaUtensils, FaBoxOpen, FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold text-primary">Your Kitchen</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="rounded-l-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors">
            <FaSearch />
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/pantry" className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all">
          <FaBoxOpen className="text-4xl text-primary mb-2" />
          <span className="text-lg font-semibold">My Pantry</span>
        </Link>
        <Link href="/recipes" className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all">
          <FaUtensils className="text-4xl text-secondary mb-2" />
          <span className="text-lg font-semibold">Recipes</span>
        </Link>
        <Link href="/scan" className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all">
          <FaCamera className="text-4xl text-accent mb-2" />
          <span className="text-lg font-semibold">Scan Items</span>
        </Link>
      </div>
      <div className="bg-accent/20 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 text-primary">AI-powered Pantry Management</h2>
          <p className="text-gray-700">Let AI help you add items to your pantry, suggest recipes, and keep track of expiration dates. Try scanning items or searching for recipes now!</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/scan" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors">Scan Items</Link>
          <Link href="/recipes" className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition-colors">Find Recipes</Link>
        </div>
      </div>
    </div>
  );
}
