"use client";
import { useEffect, useState } from "react";
import { FaHeart, FaSearch, FaUtensils, FaCheckCircle, FaTimesCircle, FaClock, FaUsers } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ExtendedSession } from "../types/auth";

interface RecipesSectionProps {
  onNavigate: (section: string) => void;
}

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

type DetailedRecipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  analyzedInstructions: Array<{
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        name: string;
        image: string;
      }>;
      equipment: Array<{
        name: string;
        image: string;
      }>;
    }>;
  }>;
  extendedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
    original: string;
    image: string;
  }>;
  nutrition: {
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
  };
  sourceUrl: string;
  spoonacularSourceUrl: string;
};

type RecipeResponse = {
  pantryIngredients?: string[];
  recipes?: Recipe[];
  message?: string;
};

export default function RecipesSection({ onNavigate }: RecipesSectionProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<DetailedRecipe | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { data: session } = useSession() as { data: ExtendedSession | null };

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    
    setLoading(true);
    fetch(`/api/recipes/by-pantry?userId=${userId}`)
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
  }, [session]);

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
        setRecipes(searchResults.map((recipe: Recipe) => ({
          ...recipe,
          matchPercentage: Math.round((recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)) * 100)
        })));
      }
    } catch {
      setError("Failed to search recipes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed recipe information
  const handleViewDetails = async (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setLoadingDetails(true);
    setDetailedRecipe(null);
    
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`);
      const detailedData = await res.json();
      if (detailedData.error) {
        setError(detailedData.error);
      } else {
        setDetailedRecipe(detailedData);
      }
    } catch {
      setError("Failed to load recipe details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setDetailedRecipe(null);
    setLoadingDetails(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-5xl mx-auto px-4 py-10 flex-1 flex flex-col">
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
            <button 
              onClick={() => onNavigate('pantry')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors inline-block"
            >
              Go to Pantry
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src={recipe.image} 
                      alt={recipe.title} 
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
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
                      onClick={() => handleViewDetails(recipe)}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                      <FaUtensils /> View Full Recipe
                    </button>
                    <button className="w-full bg-accent text-primary px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
                      <FaHeart /> Save Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>

                {loadingDetails ? (
                  <div className="text-center py-10">
                    <div className="text-gray-500">Loading recipe details...</div>
                  </div>
                ) : detailedRecipe ? (
                  <>
                    <div className="relative w-full h-64 mb-6">
                      <Image 
                        src={detailedRecipe.image} 
                        alt={detailedRecipe.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      />
                    </div>

                    {/* Recipe Info */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <FaClock className="text-blue-500 text-xl mx-auto mb-2" />
                        <div className="font-semibold text-blue-800">{detailedRecipe.readyInMinutes} min</div>
                        <div className="text-sm text-blue-600">Total Time</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <FaUsers className="text-green-500 text-xl mx-auto mb-2" />
                        <div className="font-semibold text-green-800">{detailedRecipe.servings}</div>
                        <div className="text-sm text-green-600">Servings</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <span className="text-orange-500 text-xl font-bold">🔥</span>
                        <div className="font-semibold text-orange-800">{detailedRecipe.nutrition?.calories || 'N/A'}</div>
                        <div className="text-sm text-orange-600">Calories</div>
                      </div>
                    </div>

                    {/* Summary */}
                    {detailedRecipe.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">About This Recipe</h3>
                        <p className="text-gray-700 leading-relaxed">{detailedRecipe.summary}</p>
                      </div>
                    )}

                    {/* Ingredients */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Ingredients</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {detailedRecipe.extendedIngredients?.map((ingredient, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                              <span className="text-gray-700">{ingredient.original}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Instructions</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {detailedRecipe.analyzedInstructions?.[0]?.steps ? (
                          <ol className="space-y-4">
                            {detailedRecipe.analyzedInstructions[0].steps.map((step, index) => (
                              <li key={index} className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {step.number}
                                </span>
                                <p className="text-gray-700 leading-relaxed pt-1">{step.step}</p>
                              </li>
                            ))}
                          </ol>
                        ) : detailedRecipe.instructions ? (
                          <p className="text-gray-700 leading-relaxed">{detailedRecipe.instructions}</p>
                        ) : (
                          <p className="text-gray-500 italic">Instructions not available for this recipe.</p>
                        )}
                      </div>
                    </div>

                    {/* Source Link */}
                    {detailedRecipe.sourceUrl && (
                      <div className="pt-4 border-t border-gray-200">
                        <a 
                          href={detailedRecipe.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-secondary underline"
                        >
                          View Original Recipe →
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-red-500">Failed to load recipe details. Please try again.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 