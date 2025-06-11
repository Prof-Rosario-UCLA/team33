"use client";
import { useState } from 'react';
import { FaCheck, FaTimes, FaPlus, FaRobot } from 'react-icons/fa';

interface DetectedItem {
  name: string;
  selected: boolean;
  quantity: number;
}

interface ItemSelectionProps {
  detectedItems: string[];
  onConfirm: (selectedItems: { name: string; qty: number }[]) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ItemSelection({ 
  detectedItems, 
  onConfirm, 
  onClose, 
  isLoading = false 
}: ItemSelectionProps) {
  const [items, setItems] = useState<DetectedItem[]>(
    (detectedItems || []).map(item => ({
      name: item,
      selected: true, // Default to selected
      quantity: 1
    }))
  );

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  const handleConfirm = () => {
    const selectedItems = items
      .filter(item => item.selected)
      .map(item => ({ name: item.name, qty: item.quantity }));
    
    onConfirm(selectedItems);
  };

  const selectedCount = items.filter(item => item.selected).length;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <FaRobot className="text-6xl text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold mb-2">Analyzing Image...</h2>
          <p className="text-gray-600">AI is detecting items in your photo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaRobot className="text-primary" />
              Items Detected
            </h2>
            <p className="text-sm text-gray-600">
              AI found {detectedItems.length} items • {selectedCount} selected
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <FaTimes className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No food items detected in this image.</p>
              <p className="text-sm text-gray-500 mt-2">Try taking a clearer photo of food items.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Review and select the items you want to add to your pantry:
              </p>
              
              {items.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    item.selected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleItem(index)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.selected
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {item.selected && <FaCheck className="text-xs" />}
                    </button>
                    
                    <span className={`font-medium capitalize ${
                      item.selected ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {item.name}
                    </span>
                  </div>

                  {item.selected && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 min-w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={selectedCount === 0}
                className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  selectedCount > 0
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaPlus /> Add {selectedCount} Item{selectedCount !== 1 ? 's' : ''} to Pantry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 