import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';

// Initialize the Vision client with the service account key
const visionClient = new ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), 'google_vision_service.json'),
});

const FOOD_KEYWORDS = [
  // Fruits
  'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry', 'blackberry',
  'lemon', 'lime', 'grapefruit', 'pear', 'peach', 'plum', 'cherry', 'apricot', 'kiwi',
  'mango', 'pineapple', 'watermelon', 'cantaloupe', 'honeydew', 'avocado', 'coconut',
  
  // Vegetables
  'tomato', 'potato', 'onion', 'garlic', 'carrot', 'celery', 'lettuce', 'spinach', 'kale',
  'broccoli', 'cauliflower', 'cabbage', 'pepper', 'cucumber', 'zucchini', 'eggplant',
  'mushroom', 'corn', 'peas', 'beans', 'asparagus', 'artichoke', 'beet', 'radish',
  'turnip', 'parsnip', 'sweet potato', 'squash', 'pumpkin', 'okra', 'brussels sprouts',
  
  // Proteins
  'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'fish', 'salmon', 'tuna', 'cod',
  'shrimp', 'crab', 'lobster', 'egg', 'tofu', 'tempeh', 'seitan', 'beans', 'lentils',
  'chickpeas', 'nuts', 'almonds', 'walnuts', 'peanuts', 'cashews', 'pistachios', 'eggs',
  
  // Dairy
  'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'cottage cheese',
  'mozzarella', 'cheddar', 'parmesan', 'swiss', 'feta', 'goat cheese',
  
  // Grains & Starches
  'rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'barley', 'wheat', 'rye',
  'cereal', 'crackers', 'noodles', 'couscous', 'bulgur', 'millet', 'buckwheat',
  
  // Pantry staples
  'oil', 'olive oil', 'vinegar', 'salt', 'pepper', 'sugar', 'honey', 'maple syrup',
  'soy sauce', 'hot sauce', 'ketchup', 'mustard', 'mayonnaise', 'jam', 'jelly',
  'peanut butter', 'almond butter', 'tahini', 'vanilla', 'cinnamon', 'oregano',
  'basil', 'thyme', 'rosemary', 'parsley', 'cilantro', 'dill', 'sage', 'paprika',
  
  // Beverages & Others
  'coffee', 'tea', 'juice', 'wine', 'beer', 'soda', 'water', 'broth', 'stock',
  'coconut milk', 'almond milk', 'oat milk', 'soy milk'
];

// Non-food items to exclude
const NON_FOOD_ITEMS = [
  'plate', 'bowl', 'cup', 'glass', 'fork', 'knife', 'spoon', 'table', 'counter',
  'kitchen', 'cabinet', 'drawer', 'refrigerator', 'stove', 'oven', 'microwave',
  'cutting board', 'pan', 'pot', 'container', 'bag', 'box', 'package', 'wrapper',
  'bottle', 'can', 'jar', 'packaging', 'label', 'brand', 'logo', 'text', 'paper',
  'plastic', 'metal', 'wood', 'ceramic', 'glass', 'fabric', 'person', 'hand',
  'finger', 'arm', 'face', 'clothing', 'shirt', 'background', 'wall', 'floor',
  'ceiling', 'light', 'shadow', 'reflection', 'color', 'white', 'black', 'red',
  'blue', 'green', 'yellow', 'orange', 'purple', 'brown', 'gray', 'food', 'dairy product',
  'produce', 'spice', 'drink', 'recipe'
];

interface LocalizedObjectAnnotation {
  name?: string | null;
  score?: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Call Google Vision API with label detection
    const [labelResult] = await visionClient.labelDetection({
      image: { content: buffer },
    });

    const labels = labelResult.labelAnnotations || [];
    
    // Try object localization
    let objects: LocalizedObjectAnnotation[] = [];
    try {
      if (visionClient.objectLocalization) {
        const [objectResult] = await visionClient.objectLocalization({
          image: { content: buffer },
        });
        objects = objectResult.localizedObjectAnnotations || [];
      }
    } catch {
      console.log('Object localization not available, continuing with labels only');
    }

    // Combine all detected items
    const detectedFoodItems = new Set<string>();
    const allDetections: Array<{item: string, score: number, source: string}> = [];

    // Process labels
    labels.forEach(label => {
      const description = label.description?.toLowerCase() || '';
      const score = label.score || 0;
      
      if (score > 0.3) { // Lower threshold for more results
        allDetections.push({item: description, score, source: 'label'});
      }
    });

    // Process objects
    objects.forEach(object => {
      const name = object.name?.toLowerCase() || '';
      const score = object.score || 0;
      
      if (score > 0.3) { // Lower threshold
        allDetections.push({item: name, score, source: 'object'});
      }
    });

    // Filter for food items
    allDetections.forEach(detection => {
      const item = detection.item.trim();
      
      // Skip if it's a known non-food item
      if (NON_FOOD_ITEMS.some(nonFood => item.includes(nonFood) || nonFood.includes(item))) {
        return;
      }
      
      // Direct keyword match with fuzzy matching
      const directMatch = FOOD_KEYWORDS.find(food => 
        item.includes(food) || food.includes(item) || item === food
      );
      
      if (directMatch) {
        detectedFoodItems.add(directMatch);
        return;
      }
      
      // Check if it's food-related
      if (isFoodRelated(item) && detection.score > 0.4) {
        // Clean up the item name
        const cleanedItem = cleanFoodName(item);
        if (cleanedItem && cleanedItem.length > 2) {
          detectedFoodItems.add(cleanedItem);
        }
      }
    });

    // Convert to array and clean up
    const foodItems = Array.from(detectedFoodItems)
      .map(item => item.trim())
      .filter(item => item.length > 1)
      .filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
      .slice(0, 15); // Increase limit to 15 items

    return NextResponse.json({
      success: true,
      detectedItems: foodItems,
      confidence: foodItems.length > 0 ? 'high' : 'low',
      totalDetections: allDetections.length,
      rawLabels: labels.slice(0, 10).map(l => ({ description: l.description, score: l.score })),
      rawObjects: objects.slice(0, 5).map(o => ({ name: o.name, score: o.score }))
    });

  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json({
      error: 'Failed to analyze image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Improved food detection logic
function isFoodRelated(item: string): boolean {
  const foodTerms = [
    // Food categories
    'food', 'fruit', 'vegetable', 'meat', 'dairy', 'grain', 'spice', 'herb', 'nut',
    'seed', 'bean', 'legume', 'cereal', 'pasta', 'bread', 'cheese', 'milk', 'egg',
    'fish', 'seafood', 'poultry', 'beef', 'pork', 'lamb', 'chicken', 'turkey',
    
    // Food descriptors
    'fresh', 'organic', 'natural', 'raw', 'cooked', 'baked', 'fried', 'grilled',
    'steamed', 'boiled', 'roasted', 'frozen', 'canned', 'dried', 'pickled',
    
    // Food contexts
    'ingredient', 'produce', 'grocery', 'cooking', 'recipe', 'meal',
    'snack', 'drink', 'beverage', 'edible', 'cuisine', 'dish'
  ];
  
  // Exclude generic descriptors that might give false positives
  const excludeTerms = [
    'container', 'package', 'wrapper', 'bag', 'box', 'bottle', 'can', 'jar',
    'brand', 'label', 'logo', 'text', 'color', 'size', 'shape', 'material'
  ];
  
  // Check if it contains exclude terms
  if (excludeTerms.some(term => item.includes(term))) {
    return false;
  }
  
  // Check for food terms
  return foodTerms.some(term => item.includes(term) || term.includes(item));
}

// Clean up detected food names
function cleanFoodName(item: string): string {
  // Remove common non-food words
  const wordsToRemove = ['fresh', 'organic', 'natural', 'raw', 'cooked', 'frozen', 'dried'];
  let cleaned = item;
  
  wordsToRemove.forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
  });
  
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
} 