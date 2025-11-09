import React, { useEffect, useRef, useState } from 'react';

interface ThumbnailPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  time: number;
  position: number;
  duration: number;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  videoRef,
  time,
  position,
  duration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const captureRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canvasRef.current) return;

    // Create a hidden video element for capturing frames
    if (!captureRef.current) {
      captureRef.current = document.createElement('video');
      captureRef.current.src = video.src;
      captureRef.current.crossOrigin = 'anonymous';
      captureRef.current.muted = true;
    }

    const captureVideo = captureRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    captureVideo.currentTime = time;

    const handleSeeked = () => {
      canvas.width = 160;
      canvas.height = 90;
      ctx.drawImage(captureVideo, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL());
    };

    captureVideo.addEventListener('seeked', handleSeeked);

    return () => {
      captureVideo.removeEventListener('seeked', handleSeeked);
    };
  }, [time, videoRef]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      className="absolute bottom-full mb-2 transform -translate-x-1/2 pointer-events-none"
      style={{ left: `${position}%` }}
    >
      <div className="bg-player-controls/95 backdrop-blur-sm rounded-lg border border-border overflow-hidden shadow-lg">
        <canvas ref={canvasRef} className="hidden" />
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Preview"
            className="w-40 h-auto block"
          />
        ) : (
          <div className="w-40 h-24 flex items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        )}
        <div className="px-2 py-1 text-center">
          <span className="text-xs font-medium text-foreground">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
