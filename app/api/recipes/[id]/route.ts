import { NextRequest, NextResponse } from 'next/server';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Interface for detailed recipe information
interface DetailedRecipe {
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
}

// GET: Get detailed recipe information by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;
    
    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe ID' }, { status: 400 });
    }

    // Call Spoonacular API for detailed recipe information
    const spoonacularUrl = `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    
    const response = await fetch(spoonacularUrl);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const recipe: DetailedRecipe = await response.json();
    
    // Transform and clean the data
    const transformedRecipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      summary: recipe.summary?.replace(/<[^>]*>/g, ''), // Remove HTML tags
      instructions: recipe.instructions?.replace(/<[^>]*>/g, ''), // Remove HTML tags
      analyzedInstructions: recipe.analyzedInstructions,
      extendedIngredients: recipe.extendedIngredients,
      nutrition: recipe.nutrition,
      sourceUrl: recipe.sourceUrl,
      spoonacularSourceUrl: recipe.spoonacularSourceUrl
    };
    
    return NextResponse.json(transformedRecipe);
  } catch (error) {
    console.error('Error fetching detailed recipe:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch recipe details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 