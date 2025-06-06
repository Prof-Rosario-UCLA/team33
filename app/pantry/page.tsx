import { FaPlus, FaEgg, FaAppleAlt, FaBreadSlice, FaCheese, FaDrumstickBite, FaCarrot, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";

export default function PantryPage() {
  // Mock pantry items
  const items = [
    { name: "Apples", icon: <FaAppleAlt className="text-primary" /> },
    { name: "Bread", icon: <FaBreadSlice className="text-secondary" /> },
    { name: "Milk", icon: <FaBoxOpen className="text-accent" /> },
    { name: "Chicken", icon: <FaDrumstickBite className="text-primary" /> },
    { name: "Flour", icon: <FaBoxOpen className="text-secondary" /> },
    { name: "Eggs", icon: <FaEgg className="text-accent" /> },
    { name: "Cheese", icon: <FaCheese className="text-primary" /> },
    { name: "Onions", icon: <FaCarrot className="text-secondary" /> },
    { name: "Pasta", icon: <FaBoxOpen className="text-accent" /> },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary">In Your Pantry</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search pantry"
            className="rounded-l-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors flex items-center gap-2">
            <FaPlus /> Add Item
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
        {items.map((item) => (
          <div key={item.name} className="flex flex-col items-center bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="text-3xl mb-2">{item.icon}</div>
            <span className="font-semibold text-gray-800">{item.name}</span>
          </div>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-bold text-secondary mb-4">Recipe Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Chicken Stir-Fry</span>
            <span className="text-gray-600 text-sm mb-1">3 of 5 ingredients</span>
            <button className="mt-2 bg-primary text-white px-4 py-1 rounded hover:bg-secondary transition-colors">View Recipe</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Tomato Basil Pasta</span>
            <span className="text-gray-600 text-sm mb-1">4 of 6 ingredients</span>
            <button className="mt-2 bg-primary text-white px-4 py-1 rounded hover:bg-secondary transition-colors">View Recipe</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Avocado Salad</span>
            <span className="text-gray-600 text-sm mb-1">4 of 6 ingredients</span>
            <button className="mt-2 bg-primary text-white px-4 py-1 rounded hover:bg-secondary transition-colors">View Recipe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
