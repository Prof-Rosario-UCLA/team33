"use client";
import { useState, useRef, useEffect } from 'react';
import { FaCamera, FaUpload, FaRedo, FaCheck } from 'react-icons/fa';
import Image from 'next/image';

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for modal
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    } catch {
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="camera-dialog-title"
      aria-describedby="camera-dialog-description"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="camera-dialog-title" className="text-xl font-bold text-gray-800">
            Capture Items
          </h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
            aria-label="Close camera dialog"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p id="camera-dialog-description" className="sr-only">
            Use your camera to capture items or upload an existing photo for AI analysis
          </p>
          
          {error && (
            <div 
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-4"
              role="alert"
              aria-live="polite"
            >
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
                    aria-label="Camera preview for capturing items"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={capturePhoto}
                      className="bg-white text-primary p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Capture photo"
                    >
                      <FaCamera className="text-2xl" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Camera controls */
                <div className="text-center space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <FaCamera className="text-6xl text-gray-400 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-gray-600 mb-4">Capture items with your camera or upload an image</p>
                    
                    <div className="flex gap-4 justify-center" role="group" aria-label="Image capture options">
                      <button
                        onClick={startCamera}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <FaCamera aria-hidden="true" /> Use Camera
                      </button>
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                      >
                        <FaUpload aria-hidden="true" /> Upload Photo
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      aria-label="Upload image file"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview captured image */
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative inline-block max-w-full max-h-96">
                  <Image 
                    src={capturedImage} 
                    alt="Captured image preview for AI analysis" 
                    width={500}
                    height={400}
                    className="max-w-full max-h-96 mx-auto rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              </div>
              
              <div className="flex gap-4 justify-center" role="group" aria-label="Image preview actions">
                <button
                  onClick={reset}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <FaRedo aria-hidden="true" /> Retake
                </button>
                
                <button
                  onClick={confirmImage}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                >
                  <FaCheck aria-hidden="true" /> Analyze Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas 
          ref={canvasRef} 
          className="hidden" 
          aria-hidden="true"
        />
      </div>
    </div>
  );
} 