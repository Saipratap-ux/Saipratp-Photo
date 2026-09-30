import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, Check, Timer } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUri: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Unable to access camera. Please check camera permissions in your browser.'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCountdown(null);
      startCamera(facingMode);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleTriggerCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing, flip horizontally for natural selfie mirror
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm"
    >
      <div
        id="camera-modal-container"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100">
              {capturedImage ? 'Confirm Your Photo' : 'Take a Portrait Photo'}
            </h3>
          </div>
          <button
            id="camera-modal-close-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video / Snapshot Viewport */}
        <div className="relative aspect-[3/4] max-h-[460px] w-full bg-stone-950 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-sm text-rose-400">
              <p className="font-semibold mb-1">Camera Not Available</p>
              <p className="text-xs text-stone-400">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />

              {/* Guiding Portrait Silhouette Oval */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[75%] w-[65%] rounded-[50%] border-2 border-dashed border-amber-400/50 bg-amber-400/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]" />
              </div>

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
                  <span className="text-7xl font-extrabold text-amber-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-stone-800 bg-stone-900/90 px-5 py-4">
          {capturedImage ? (
            <>
              <button
                id="camera-retake-btn"
                onClick={handleRetake}
                className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retake
              </button>

              <button
                id="camera-confirm-btn"
                onClick={handleConfirm}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
              >
                <Check className="h-4 w-4" />
                Use This Photo
              </button>
            </>
          ) : (
            <>
              <button
                id="camera-switch-mode-btn"
                onClick={() =>
                  setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
                }
                className="flex items-center gap-1.5 rounded-lg border border-stone-800 px-3 py-2 text-xs font-medium text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Flip Cam</span>
              </button>

              <button
                id="camera-capture-now-btn"
                onClick={takeSnapshot}
                className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-amber-400 bg-white p-1 text-stone-950 shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
              >
                <div className="h-10 w-10 rounded-full bg-amber-500 hover:bg-amber-400" />
              </button>

              <button
                id="camera-timer-capture-btn"
                onClick={handleTriggerCapture}
                className="flex items-center gap-1.5 rounded-lg border border-stone-800 px-3 py-2 text-xs font-medium text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              >
                <Timer className="h-3.5 w-3.5 text-amber-400" />
                <span>3s Timer</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
