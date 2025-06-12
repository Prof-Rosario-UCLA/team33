import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Interface for Spoonacular recipe response
interface SpoonacularRecipe {
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
  unusedIngredients: Array<{
    name: string;
    image: string;
    original: string;
  }>;
  likes: number;
}

// GET: Find recipes based on user's pantry items
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const number = searchParams.get('number') || '12';
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get user's pantry items
    const pantryItems = await prisma.pantryItem.findMany({
      where: { userId },
      select: { name: true }
    });

    if (pantryItems.length === 0) {
      return NextResponse.json({ message: 'No pantry items found for this user', recipes: [] });
    }

    // Convert pantry items to ingredients string
    const ingredients = pantryItems.map((item: { name: string }) => item.name).join(',');

    // Call Spoonacular API
    const spoonacularUrl = `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(ingredients)}&number=${number}&ranking=1&ignorePantry=true`;
    
    const response = await fetch(spoonacularUrl);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const recipes = await response.json();
    
    // Transform the data to include more useful information
    const transformedRecipes = recipes.map((recipe: SpoonacularRecipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
      unusedIngredients: recipe.unusedIngredients,
      likes: recipe.likes,
      matchPercentage: Math.round((recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)) * 100)
    }));
    
    return NextResponse.json({
      pantryIngredients: ingredients.split(','),
      recipes: transformedRecipes
    });
  } catch (error) {
    console.error('Error fetching recipes by pantry:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch recipes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 