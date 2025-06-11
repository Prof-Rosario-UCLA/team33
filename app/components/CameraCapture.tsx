"use client";
import { useState, useRef, useCallback } from 'react';
import { FaCamera, FaUpload, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onImageCapture, onClose }: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use file upload.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirm captured/uploaded image
  const confirmImage = () => {
    if (capturedImage) {
      // Convert data URL back to file
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
          onImageCapture(file);
        });
    }
  };

  // Reset to start over
  const reset = () => {
    setCapturedImage(null);
    setError('');
    stopCamera();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Capture Items</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!capturedImage ? (
            <div className="space-y-4">
              {/* Camera view */}
              {isStreaming ? (
                <div className="relative">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={capturePhoto}
                      className="bg-white text-primary p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaCamera className="text-2xl" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Camera controls */
                <div className="text-center space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <FaCamera className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Capture items with your camera or upload an image</p>
                    
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={startCamera}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                      >
                        <FaCamera /> Use Camera
                      </button>
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <FaUpload /> Upload Photo
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview captured image */
            <div className="space-y-4">
              <div className="text-center">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={reset}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FaRedo /> Retake
                </button>
                
                <button
                  onClick={confirmImage}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaCheck /> Analyze Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
} 