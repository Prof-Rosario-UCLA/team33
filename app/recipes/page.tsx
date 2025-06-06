import { FaHeart, FaSearch, FaUtensils } from "react-icons/fa";
import Link from "next/link";

export default function RecipesPage() {
  // Mock recipes
  const recipes = [
    {
      name: "Chicken Stir-Fry",
      match: "3 of 5 ingredients",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Tomato Basil Pasta",
      match: "4 of 6 ingredients",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Avocado Salad",
      match: "4 of 6 ingredients",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary">Recipe Suggestions</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search recipes"
            className="rounded-l-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.name} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
            <img src={recipe.image} alt={recipe.name} className="w-full h-32 object-cover rounded mb-3" />
            <span className="text-lg font-semibold mb-1">{recipe.name}</span>
            <span className="text-gray-600 text-sm mb-2">{recipe.match}</span>
            <div className="flex gap-2">
              <button className="bg-primary text-white px-4 py-1 rounded hover:bg-secondary transition-colors flex items-center gap-2">
                <FaUtensils /> View
              </button>
              <button className="bg-accent text-primary px-3 py-1 rounded hover:bg-secondary/80 transition-colors flex items-center gap-1">
                <FaHeart /> Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
