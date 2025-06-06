import { FaCamera, FaMagic } from "react-icons/fa";

export default function ScanPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center">
      <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <FaCamera className="text-6xl text-primary mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Scan Items</h1>
        <p className="text-gray-700 mb-4 text-center">Use your camera to add items to your pantry. Let AI recognize and add them for you!</p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center gap-2">
          <FaMagic /> Start Scanning
        </button>
      </div>
      <div className="bg-accent/20 rounded-lg p-6 w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-primary mb-2">AI-powered Pantry Management</h2>
        <p className="text-gray-700 text-center">Our AI can help you quickly add items by recognizing them through your camera. Try it now and keep your pantry up to date effortlessly!</p>
      </div>
    </div>
  );
}
