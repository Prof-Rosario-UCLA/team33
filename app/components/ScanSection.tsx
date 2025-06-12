"use client";
import { useState } from "react";
import { FaCamera, FaMagic, FaPlus } from "react-icons/fa";
import { useSession } from "next-auth/react";
import CameraCapture from "./CameraCapture";
import ItemSelection from "./ItemSelection";
import { ExtendedSession } from "../types/auth";

interface ScanSectionProps {
  onNavigate: (section: string) => void;
}

export default function ScanSection({ onNavigate }: ScanSectionProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const handleImageCapture = async (file: File) => {
    setShowCamera(false);
    setAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/vision/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.detectedItems.length > 0) {
        setDetectedItems(data.detectedItems);
        setShowSelection(true);
      } else if (data.detectedItems.length === 0) {
        setError("No food items detected in the image. Try taking a clearer photo of food items.");
      } else {
        setError(data.error || "Failed to analyze image");
      }
    } catch {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmItems = async (selectedItems: { name: string; qty: number }[]) => {
    const userId = session?.user?.id;
    if (!userId) {
      setError("Authentication required. Please sign in.");
      return;
    }

    setShowSelection(false);
    
    try {
      const addPromises = selectedItems.map(item =>
        fetch('/api/pantry-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: item.name, 
            qty: item.qty, 
            userId: userId 
          }),
        })
      );

      await Promise.all(addPromises);
      
      onNavigate('pantry');
    } catch {
      setError("Failed to add items to pantry. Please try again.");
    }
  };

  const closeModals = () => {
    setShowCamera(false);
    setShowSelection(false);
    setAnalyzing(false);
    setDetectedItems([]);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center">
      <div className="flex flex-col items-center bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <FaCamera className="text-6xl text-primary mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Scan Items</h1>
        <p className="text-gray-700 mb-4 text-center">
          Use your camera to add items to your pantry. Let AI recognize and add them for you!
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 w-full">
            {error}
          </div>
        )}
        
        <button 
          onClick={() => setShowCamera(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <FaMagic /> Start Scanning
        </button>
      </div>
      
      <div className="bg-accent/20 rounded-lg p-6 w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-primary mb-2">AI-powered Pantry Management</h2>
        <p className="text-gray-700 text-center mb-4">
          Our AI can help you quickly add items by recognizing them through your camera. 
          Take a photo of your groceries and let AI do the work!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FaCamera className="text-primary" />
            </div>
            <h3 className="font-semibold text-sm">1. Capture</h3>
            <p className="text-xs text-gray-600">Take a photo of your food items</p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FaMagic className="text-secondary" />
            </div>
            <h3 className="font-semibold text-sm">2. Analyze</h3>
            <p className="text-xs text-gray-600">AI detects and identifies items</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-600/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FaPlus className="text-green-600" />
            </div>
            <h3 className="font-semibold text-sm">3. Add</h3>
            <p className="text-xs text-gray-600">Select items to add to pantry</p>
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraCapture 
          onImageCapture={handleImageCapture}
          onClose={closeModals}
        />
      )}

      {showSelection && (
        <ItemSelection
          detectedItems={detectedItems}
          onConfirm={handleConfirmItems}
          onClose={closeModals}
        />
      )}

      {analyzing && (
        <ItemSelection
          detectedItems={[]}
          onConfirm={() => {}}
          onClose={closeModals}
          isLoading={true}
        />
      )}
    </div>
  );
} 