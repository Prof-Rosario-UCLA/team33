import { NextRequest, NextResponse } from 'next/server';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// GET: Find recipes based on pantry ingredients 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ingredients = searchParams.get('ingredients');
    const number = searchParams.get('number') || '12'; // Default to 12 recipes
    
    if (!ingredients) {
      return NextResponse.json({ error: 'Missing ingredients parameter' }, { status: 400 });
    }

    // Call Spoonacular API
    const spoonacularUrl = `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(ingredients)}&number=${number}&ranking=1&ignorePantry=true`;
    
    const response = await fetch(spoonacularUrl);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const recipes = await response.json();
    
    // Transform the data to include more useful information
    const transformedRecipes = recipes.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
      unusedIngredients: recipe.unusedIngredients,
      likes: recipe.likes
    }));
    
    return NextResponse.json(transformedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch recipes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 