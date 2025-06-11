import { FaCamera, FaUtensils, FaBoxOpen, FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold text-primary">Your Kitchen</h1>
        <div className="flex gap-2" role="search" aria-label="Search functionality">
          <label htmlFor="search-input" className="sr-only">
            Search your pantry and recipes
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search"
            className="rounded-l-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            aria-describedby="search-help"
          />
          <span id="search-help" className="sr-only">
            Search through your pantry items and recipes
          </span>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Search"
          >
            <FaSearch aria-hidden="true" />
          </button>
        </div>
      </header>
      
      <section aria-labelledby="main-features">
        <h2 id="main-features" className="sr-only">Main Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link 
            href="/pantry" 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-describedby="pantry-description"
          >
            <FaBoxOpen className="text-4xl text-primary mb-2" aria-hidden="true" />
            <span className="text-lg font-semibold">My Pantry</span>
            <span id="pantry-description" className="sr-only">
              View and manage items in your pantry
            </span>
          </Link>
          
          <Link 
            href="/recipes" 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-describedby="recipes-description"
          >
            <FaUtensils className="text-4xl text-secondary mb-2" aria-hidden="true" />
            <span className="text-lg font-semibold">Recipes</span>
            <span id="recipes-description" className="sr-only">
              Discover recipes based on your pantry items
            </span>
          </Link>
          
          <Link 
            href="/scan" 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-describedby="scan-description"
          >
            <FaCamera className="text-4xl text-accent mb-2" aria-hidden="true" />
            <span className="text-lg font-semibold">Scan Items</span>
            <span id="scan-description" className="sr-only">
              Use AI to scan and add items to your pantry
            </span>
          </Link>
        </div>
      </section>
      
      <section 
        className="bg-accent/20 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6"
        aria-labelledby="ai-features"
      >
        <div className="flex-1">
          <h2 id="ai-features" className="text-xl font-bold mb-2 text-primary">
            AI-powered Pantry Management
          </h2>
          <p className="text-gray-700">
            Let AI help you add items to your pantry, suggest recipes, and keep track of expiration dates. Try scanning items or searching for recipes now!
          </p>
        </div>
        <div className="flex flex-col gap-2" role="group" aria-label="Quick actions">
          <Link 
            href="/scan" 
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Scan Items
          </Link>
          <Link 
            href="/recipes" 
            className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Find Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}
