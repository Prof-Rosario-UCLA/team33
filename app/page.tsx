import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-red-700 text-4xl font-bold mb-4">Welcome to Pantrify</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/pantry" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">My Pantry</h2>
          <p className="text-gray-600">View and manage your pantry items</p>
        </Link>

        <Link href="/recipes" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Recipes</h2>
          <p className="text-gray-600">Discover recipes based on your ingredients</p>
        </Link>

        <Link href="/scan" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Scan Items</h2>
          <p className="text-gray-600">Add items to your pantry using AI</p>
        </Link>
      </div>
    </div>
  );
}
