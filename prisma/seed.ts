import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create demo user first
  await prisma.user.upsert({
    where: { email: 'demo@pantrify.com' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@pantrify.com',
      password: 'demo-password-hash',
    },
  });

  console.log('Demo user created/updated');

  const suggestions = [
    {
      name: 'Apples',
      imageUrl: '/images/pantry/apples.png',
      description: 'Fresh apples, great for snacks and baking.',
    },
    { name: 'Bread', imageUrl: '/images/pantry/bread.png', description: 'Loaf of bread, perfect for sandwiches.' },
    { name: 'Milk', imageUrl: '/images/pantry/milk.png', description: 'Dairy or plant-based milk.' },
    { name: 'Eggs', imageUrl: '/images/pantry/eggs.png', description: 'Chicken eggs, a breakfast staple.' },
    { name: 'Cheese', imageUrl: '/images/pantry/cheese.png', description: 'Block or slices of cheese.' },
    { name: 'Chicken', imageUrl: '/images/pantry/chicken.png', description: 'Raw or cooked chicken.' },
    { name: 'Flour', imageUrl: '/images/pantry/flour.png', description: 'All-purpose or specialty flour.' },
    { name: 'Onions', imageUrl: '/images/pantry/onions.png', description: 'Yellow, white, or red onions.' },
    { name: 'Pasta', imageUrl: '/images/pantry/pasta.png', description: 'Dried pasta shapes.' },
    { name: 'Rice', imageUrl: '/images/pantry/rice.png', description: 'White or brown rice.' },
    { name: 'Tomatoes', imageUrl: '/images/pantry/tomatoes.png', description: 'Fresh or canned tomatoes.' },
    { name: 'Potatoes', imageUrl: '/images/pantry/potatoes.png', description: 'Russet, red, or Yukon gold potatoes.' },
    { name: 'Salt', imageUrl: '/images/pantry/salt.png', description: 'Table or sea salt.' },
    { name: 'Pepper', imageUrl: '/images/pantry/pepper.png', description: 'Black pepper.' },
    { name: 'Olive Oil', imageUrl: '/images/pantry/olive-oil.png', description: 'Extra virgin olive oil.' },
  ];
  for (const s of suggestions) {
    await prisma.pantrySuggestion.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log('Pantry suggestions seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
