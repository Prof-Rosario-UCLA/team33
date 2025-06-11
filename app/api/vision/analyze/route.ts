import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';

// Initialize the Vision client with the service account key
const visionClient = new ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), 'google_vision_service.json'),
});

// Common food items that might be detected
const FOOD_KEYWORDS = [
  'apple', 'banana', 'orange', 'tomato', 'potato', 'onion', 'carrot', 'bread', 'milk', 'cheese',
  'chicken', 'beef', 'pork', 'fish', 'egg', 'rice', 'pasta', 'flour', 'sugar', 'salt',
  'pepper', 'oil', 'butter', 'yogurt', 'lettuce', 'cucumber', 'bell pepper', 'broccoli',
  'spinach', 'garlic', 'ginger', 'lemon', 'lime', 'avocado', 'strawberry', 'grapes',
  'mushroom', 'corn', 'beans', 'nuts', 'cereal', 'oats', 'honey', 'jam', 'sauce'
];

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

    // Call Google Vision API
    const [result] = await visionClient.labelDetection({
      image: { content: buffer },
    });

    const labels = result.labelAnnotations || [];
    
    // Also try object localization for more detailed detection
    const [objectResult] = await visionClient.objectLocalization({
      image: { content: buffer },
    });

    const objects = objectResult.localizedObjectAnnotations || [];

    // Filter and combine results to find food items
    const detectedFoodItems = new Set<string>();

    // Process labels
    labels.forEach(label => {
      const description = label.description?.toLowerCase() || '';
      const score = label.score || 0;
      
      // Only consider high-confidence labels
      if (score > 0.5) {
        // Check if the label matches common food items
        FOOD_KEYWORDS.forEach(food => {
          if (description.includes(food) || food.includes(description)) {
            detectedFoodItems.add(food);
          }
        });
        
        // Add the label itself if it seems food-related
        if (isFoodRelated(description)) {
          detectedFoodItems.add(description);
        }
      }
    });

    // Process objects
    objects.forEach(object => {
      const name = object.name?.toLowerCase() || '';
      const score = object.score || 0;
      
      if (score > 0.5 && isFoodRelated(name)) {
        detectedFoodItems.add(name);
      }
    });

    // Convert to array and clean up
    const foodItems = Array.from(detectedFoodItems)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .slice(0, 10); // Limit to 10 items

    return NextResponse.json({
      success: true,
      detectedItems: foodItems,
      confidence: labels.length > 0 ? 'high' : 'low',
      rawLabels: labels.map(l => ({ description: l.description, score: l.score })),
      rawObjects: objects.map(o => ({ name: o.name, score: o.score }))
    });

  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json({
      error: 'Failed to analyze image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to determine if a detected item is food-related
function isFoodRelated(item: string): boolean {
  const foodTerms = [
    'food', 'fruit', 'vegetable', 'meat', 'dairy', 'grain', 'spice', 'herb',
    'beverage', 'drink', 'produce', 'ingredient', 'edible', 'cuisine',
    'grocery', 'organic', 'fresh', 'cooking', 'kitchen'
  ];
  
  return foodTerms.some(term => item.includes(term) || term.includes(item));
} 