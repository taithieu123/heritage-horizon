import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Compass, Navigation, Eye, MapPin, Volume2, Sparkles, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { HeritageItem, FoodItem, SensorState } from '../types';
import { AR_CAMERA_BACKGROUND } from '../data/mockData';

interface ARCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorState: SensorState;
  heritageItems: HeritageItem[];
  foodItems: FoodItem[];
  onSelectItem: (item: HeritageItem | FoodItem) => void;
  onUpdateBearing: (bearing: number) => void;
}

export const ARCameraModal: React.FC<ARCameraModalProps> = ({
  isOpen,
  onClose,
  sensorState,
  heritageItems,
  foodItems,
  onSelectItem,
  onUpdateBearing,
}) => {
  const [useLiveVideo, setUseLiveVideo] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [selectedTagItem, setSelectedTagItem] = useState<HeritageItem | FoodItem | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Combine items to render as AR tags
  const allTargets: Array<{ item: HeritageItem | FoodItem; type: 'heritage' | 'food' }> = [
    ...heritageItems.map((item) => ({ item, type: 'heritage' as const })),
    ...foodItems.map((item) => ({ item, type: 'food' as const })),
  ];

  // Camera video stream management
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (useLiveVideo) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, useLiveVideo]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream failed or denied:', err);
      setCameraError('Không thể mở camera phần cứng. Chuyển sang mô phỏng AR phố cổ.');
      setUseLiveVideo(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  // Touch/Mouse drag to pan compass bearing in 360°
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setStartX(e.clientX);
    // 1 pixel = ~0.4 degree
    const newBearing = (sensorState.compassBearing - deltaX * 0.4 + 360) % 360;
    onUpdateBearing(newBearing);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX;
    setStartX(e.touches[0].clientX);
    const newBearing = (sensorState.compassBearing - deltaX * 0.4 + 360) % 360;
    onUpdateBearing(newBearing);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate horizontal offset for each target based on user bearing
  // FOV is approx 60 degrees horizontally
  const fovDegrees = 70;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#121E19]/90 backdrop-blur-md flex flex-col select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top HUD Bar */}
      <div className="relative z-20 px-4 py-3 bg-[#121E19]/80 backdrop-blur-md border-b border-[#76A286]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display">AR Viewport & Không Gian Di Sản</h2>
            <p className="text-[10px] text-[#8abda9]">Kéo ngang hoặc xoay máy để quét 360°</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseLiveVideo(!useLiveVideo)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              useLiveVideo
                ? 'bg-[#1B4D3E] text-white border-[#76A286]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{useLiveVideo ? 'Camera Thật' : 'Mô Phỏng AR'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng AR Viewport"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Compass Tape Banner (Heading Ribbon) */}
      <div className="relative z-10 w-full bg-black/40 backdrop-blur-xs py-2 border-b border-white/10 flex flex-col items-center">
        <div className="flex items-center gap-2 text-white font-mono text-xs">
          <Compass className="w-3.5 h-3.5 text-[#D96B27]" />
          <span>Hướng la bàn:</span>
          <span className="font-bold text-[#baeed9]">{sensorState.compassBearing.toFixed(1)}°</span>
        </div>

        {/* Ribbon markers */}
        <div className="w-full max-w-md h-6 overflow-hidden relative mt-1">
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#D96B27] -translate-x-1/2 z-10 shadow-[0_0_8px_#D96B27]" />
          <div
            className="flex items-center h-full transition-transform duration-100 ease-out justify-center text-[10px] font-mono text-white/70 space-x-8"
            style={{
              transform: `translateX(${-((sensorState.compassBearing % 360) - 180) * 2}px)`,
            }}
          >
            {Array.from({ length: 36 }).map((_, i) => {
              const deg = i * 10;
              let label = `${deg}°`;
              if (deg === 0 || deg === 360) label = 'B (0°)';
              if (deg === 45) label = 'ĐB (45°)';
              if (deg === 90) label = 'Đ (90°)';
              if (deg === 135) label = 'ĐN (135°)';
              if (deg === 180) label = 'N (180°)';
              if (deg === 225) label = 'TN (225°)';
              if (deg === 270) label = 'T (270°)';
              if (deg === 315) label = 'TB (315°)';
              return (
                <div key={deg} className="flex flex-col items-center shrink-0">
                  <div className="h-1.5 w-0.5 bg-white/40" />
                  <span className={deg % 45 === 0 ? 'text-[#D96B27] font-bold' : ''}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-[#192823]">
        {/* Background Layer: Real Video or Generated Street Photo */}
        {useLiveVideo ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-[200%] h-full bg-cover bg-center transition-transform duration-300 ease-out opacity-90"
            style={{
              backgroundImage: `url(${AR_CAMERA_BACKGROUND})`,
              transform: `translateX(${(-sensorState.compassBearing / 360) * 40}%) scale(${zoomLevel})`,
            }}
          />
        )}

        {/* Camera Reticle / HUD Grid */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border border-white/40 rounded-full" />
            <div className="absolute w-2 h-2 bg-[#D96B27] rounded-full shadow-[0_0_12px_#D96B27]" />
          </div>
        </div>

        {/* Floating Real-Time AR Spatial Tags */}
        <div className="absolute inset-0 pointer-events-none">
          {allTargets.map(({ item, type }) => {
            // Calculate angular difference between user bearing and item bearing
            let diff = item.bearingDegrees - sensorState.compassBearing;
            while (diff > 180) diff -= 360;
            while (diff < -180) diff += 360;

            // Is the tag within the FOV?
            const isVisible = Math.abs(diff) < fovDegrees / 2;
            // Screen X percentage (50% is center)
            const screenX = 50 + (diff / (fovDegrees / 2)) * 42;
            // Screen Y based on distance: closer items lower, further items higher
            const screenY = 40 + (Math.sin(item.bearingDegrees) * 15);

            if (!isVisible) return null;

            const isHeritage = type === 'heritage';
            const isSelected = selectedTagItem?.id === item.id;

            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
                style={{
                  left: `${screenX}%`,
                  top: `${screenY}%`,
                }}
                onClick={() => {
                  setSelectedTagItem(item);
                }}
              >
                {/* Real-time AR Tag Glass Badge */}
                <div
                  className={`group px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-2.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-white text-[#151d1a] border-[#D96B27] ring-2 ring-[#D96B27]'
                      : 'bg-white/85 text-[#151d1a] border-[rgba(118,162,134,0.30)] hover:bg-white'
                  }`}
                >
                  {/* Proximity pulse pin */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-7 h-7 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
                      {isHeritage ? (
                        <MapPin className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D96B27]" />
                      )}
                    </div>
                    {/* Radial pulse in #D96B27 */}
                    <div className="absolute -inset-1 rounded-lg border-2 border-[#D96B27] animate-ping opacity-75 pointer-events-none" />
                  </div>

                  {/* Tag Information */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-xs text-[#151d1a] truncate max-w-[130px]">
                        {'title' in item ? item.title : item.name}
                      </span>
                      {isHeritage && 'hasAudioTour' in item && item.hasAudioTour && (
                        <Volume2 className="w-3 h-3 text-[#1B4D3E]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#404945] font-mono">
                      <span className="font-semibold text-[#1B4D3E]">
                        {item.distanceMeters}m
                      </span>
                      <span>·</span>
                      <span className="text-[#D96B27]">
                        {item.bearingDegrees.toFixed(0)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical stem connecting tag to focal ground */}
                <div className="w-0.5 h-6 bg-gradient-to-b from-[#1B4D3E] to-transparent mx-auto opacity-70" />
                <div className="w-2 h-2 rounded-full bg-[#D96B27] mx-auto shadow-sm" />
              </div>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
            aria-label="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1.0))}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Tag Info Bottom Drawer */}
        {selectedTagItem && (
          <div className="absolute left-4 right-4 bottom-4 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[#76A286]/30 flex items-center gap-3">
            <img
              src={selectedTagItem.imageUrl}
              alt={'title' in selectedTagItem ? selectedTagItem.title : selectedTagItem.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-sm text-[#151d1a] truncate">
                {'title' in selectedTagItem ? selectedTagItem.title : selectedTagItem.name}
              </h4>
              <p className="text-xs text-[#707974] truncate">{selectedTagItem.address}</p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="font-semibold text-[#1B4D3E]">{selectedTagItem.distanceMeters}m</span>
                <span>·</span>
                <span className="text-[#D96B27]">Hướng {selectedTagItem.bearingDegrees}°</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectItem(selectedTagItem);
                onClose();
              }}
              className="px-3.5 py-2 rounded-lg bg-[#1B4D3E] text-white font-medium text-xs hover:bg-[#003629] transition-all cursor-pointer shrink-0"
            >
              Xem Chi Tiết
            </button>
          </div>
        )}
      </div>

      {/* Bottom Hint Banner */}
      <div className="px-4 py-2 bg-[#121E19] text-center text-xs text-[#8abda9]/80 border-t border-white/5">
        Chạm vào nhãn AR để khóa tiêu điểm · Xoay màn hình để định hướng không gian
      </div>
    </div>
  );
};
