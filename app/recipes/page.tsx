"use client";
import { useEffect, useState } from "react";
import { FaHeart, FaSearch, FaUtensils, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

const USER_ID = "demo-user-id"; // Replace with real user id when auth is ready

type Recipe = {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: Array<{
    name: string;
    image: string;
    original: string;
  }>;
  missedIngredients: Array<{
    name: string;
    image: string;
    original: string;
  }>;
  matchPercentage: number;
  likes: number;
};

type RecipeResponse = {
  pantryIngredients?: string[];
  recipes?: Recipe[];
  message?: string;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Fetch recipes based on pantry items
  useEffect(() => {
    setLoading(true);
    fetch(`/api/recipes/by-pantry?userId=${USER_ID}`)
      .then(res => res.json())
      .then((data: RecipeResponse) => {
        if (data.recipes) {
          setRecipes(data.recipes);
          setPantryIngredients(data.pantryIngredients || []);
        } else if (data.message) {
          setError(data.message);
        }
      })
      .catch(() => setError("Failed to load recipes"))
      .finally(() => setLoading(false));
  }, []);

  // Handle search for additional recipes
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/recipes?ingredients=${encodeURIComponent(searchTerm)}&number=12`);
      const searchResults = await res.json();
      if (searchResults.error) {
        setError(searchResults.error);
      } else {
        setRecipes(searchResults.map((recipe: any) => ({
          ...recipe,
          matchPercentage: Math.round((recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)) * 100)
        })));
      }
    } catch (err) {
      setError("Failed to search recipes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Recipe Suggestions</h1>
          {pantryIngredients.length > 0 && (
            <p className="text-gray-600 mt-2">
              Based on your pantry: {pantryIngredients.join(", ")}
            </p>
          )}
        </div>
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search with ingredients (e.g. chicken, rice)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-l-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background min-w-80"
          />
          <button 
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">{error}</div>}
      
      {loading ? (
        <div className="text-gray-500 text-center py-10">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          <p className="mb-4">No recipes found. Try adding some items to your pantry first!</p>
          <Link 
            href="/pantry" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors inline-block"
          >
            Go to Pantry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 hover:shadow-lg transition-shadow">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-48 object-cover rounded-lg mb-4" 
              />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{recipe.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {recipe.matchPercentage}% match
                </div>
                <div className="text-gray-600 text-sm">
                  ❤️ {recipe.likes}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Have: {recipe.usedIngredientCount} ingredients</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaTimesCircle className="text-red-500" />
                  <span>Need: {recipe.missedIngredientCount} ingredients</span>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 mb-2"
                >
                  <FaUtensils /> View Details
                </button>
                <button className="w-full bg-accent text-primary px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
                  <FaHeart /> Save Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title} 
                className="w-full h-64 object-cover rounded-lg mb-6" 
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600 flex items-center gap-2">
                    <FaCheckCircle /> Ingredients You Have ({selectedRecipe.usedIngredientCount})
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.usedIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <img src={ingredient.image} alt={ingredient.name} className="w-6 h-6 rounded" />
                        <span>{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600 flex items-center gap-2">
                    <FaTimesCircle /> Missing Ingredients ({selectedRecipe.missedIngredientCount})
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.missedIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <img src={ingredient.image} alt={ingredient.name} className="w-6 h-6 rounded" />
                        <span>{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {selectedRecipe.matchPercentage}% Ingredient Match
                  </div>
                  <div className="text-gray-600">
                    ❤️ {selectedRecipe.likes} likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
