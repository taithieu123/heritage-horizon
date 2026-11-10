import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Volume2, Flame, Layers, Maximize2 } from 'lucide-react';
import { HeritageItem, FoodItem, SensorState } from '../types';

interface InteractiveMapTabProps {
  heritageItems: HeritageItem[];
  foodItems: FoodItem[];
  sensorState: SensorState;
  onSelectItem: (item: HeritageItem | FoodItem) => void;
  onOpenAR: () => void;
}

export const InteractiveMapTab: React.FC<InteractiveMapTabProps> = ({
  heritageItems,
  foodItems,
  sensorState,
  onSelectItem,
  onOpenAR,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'heritage' | 'food'>('all');
  const [selectedMapItem, setSelectedMapItem] = useState<HeritageItem | FoodItem | null>(null);

  // Map coordinates projection for Hanoi Old Quarter
  // Center is roughly 21.032, 105.845
  const centerLat = 21.033;
  const centerLng = 105.844;
  const latSpan = 0.016;
  const lngSpan = 0.024;

  const projectCoord = (lat: number, lng: number) => {
    const x = ((lng - (centerLng - lngSpan / 2)) / lngSpan) * 100;
    const y = ((centerLat + latSpan / 2 - lat) / latSpan) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const userPos = projectCoord(sensorState.coordinates.latitude, sensorState.coordinates.longitude);

  return (
    <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-[#c9dbd0] bg-[#e7f0eb] shadow-sm flex flex-col">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-xl shadow-xs border border-[#c0c9c3] pointer-events-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-[#404945] hover:text-[#151d1a]'
            }`}
          >
            Tất cả ({heritageItems.length + foodItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('heritage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'heritage'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-[#404945] hover:text-[#151d1a]'
            }`}
          >
            Di sản ({heritageItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'food'
                ? 'bg-[#D96B27] text-white shadow-xs'
                : 'text-[#404945] hover:text-[#151d1a]'
            }`}
          >
            Ẩm thực ({foodItems.length})
          </button>
        </div>

        {/* AR trigger button */}
        <button
          type="button"
          onClick={onOpenAR}
          className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all pointer-events-auto cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#baeed9]" />
          <span>Mở AR View</span>
        </button>
      </div>

      {/* SVG Canvas Map Background simulating Hanoi Old Quarter lake & street grid */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle grid pattern */}
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e2da" strokeWidth="1" />
            </pattern>
            {/* Radar scan gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#76A286" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#76A286" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="#edf6f1" />
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* Simulated Red River curve (Sông Hồng) on the east */}
          <path
            d="M 85,0 Q 95,45 88,100"
            fill="none"
            stroke="#c8e4d8"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* Simulated Hoan Kiem Lake water body */}
          <ellipse cx="68%" cy="58%" rx="48" ry="72" fill="#d0e9dd" stroke="#9ed1bd" strokeWidth="2" />
          {/* West Lake (Hồ Tây) corner */}
          <circle cx="28%" cy="10%" r="65" fill="#d0e9dd" stroke="#9ed1bd" strokeWidth="2" />

          {/* Simulated ancient Hanoi street arteries */}
          <path d="M 10 35 L 90 35" stroke="#ffffff" strokeWidth="5" />
          <path d="M 10 65 L 90 65" stroke="#ffffff" strokeWidth="4" />
          <path d="M 35 10 L 35 90" stroke="#ffffff" strokeWidth="4" />
          <path d="M 60 10 L 60 90" stroke="#ffffff" strokeWidth="5" />
          <path d="M 20 20 L 75 75" stroke="#ffffff" strokeWidth="3" />
          <path d="M 75 25 L 25 75" stroke="#ffffff" strokeWidth="3" />

          {/* User Range Rings from current location */}
          <circle
            cx={`${userPos.x}%`}
            cy={`${userPos.y}%`}
            r="80"
            fill="none"
            stroke="#1B4D3E"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <circle
            cx={`${userPos.x}%`}
            cy={`${userPos.y}%`}
            r="160"
            fill="none"
            stroke="#1B4D3E"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.25"
          />
        </svg>

        {/* User Location Radar Marker with Compass Bearing Beam */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
        >
          {/* Compass field beam pointing in user's bearing */}
          <div
            className="w-32 h-32 -ml-16 -mt-16 absolute flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${sensorState.compassBearing}deg)` }}
          >
            <div
              className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-[#1B4D3E]/25 -translate-y-6"
            />
          </div>

          {/* Center User Dot */}
          <div className="relative w-6 h-6 rounded-full bg-[#1B4D3E] border-2 border-white shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="absolute -inset-2 rounded-full border border-[#1B4D3E] animate-ping opacity-60" />
          </div>
          <span className="absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-[#1B4D3E] whitespace-nowrap shadow-xs">
            Bạn đang ở đây
          </span>
        </div>

        {/* Landmark & Culinary Pins */}
        {(filterType === 'all' || filterType === 'heritage') &&
          heritageItems.map((item) => {
            const pos = projectCoord(item.coordinates.lat, item.coordinates.lng);
            const isSelected = selectedMapItem?.id === item.id;
            return (
              <div
                key={item.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-115 active:scale-95"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setSelectedMapItem(item)}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#1B4D3E] text-white ring-2 ring-white scale-110'
                      : 'bg-white text-[#151d1a] border border-[#c9dbd0]'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#baeed9]' : 'text-[#1B4D3E]'}`} />
                  <span className="text-[11px] font-bold font-display max-w-[90px] truncate">
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}

        {(filterType === 'all' || filterType === 'food') &&
          foodItems.map((item) => {
            const pos = projectCoord(item.coordinates.lat, item.coordinates.lng);
            const isSelected = selectedMapItem?.id === item.id;
            return (
              <div
                key={item.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-115 active:scale-95"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setSelectedMapItem(item)}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#D96B27] text-white ring-2 ring-white scale-110'
                      : 'bg-white text-[#151d1a] border border-[#ffdbcb]'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#D96B27]'}`} />
                  <span className="text-[11px] font-bold font-display max-w-[90px] truncate">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}

        {/* Selected Map Item Preview Card at Bottom */}
        {selectedMapItem && (
          <div className="absolute left-3 right-3 bottom-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#c9dbd0] flex items-center justify-between gap-3 animate-slide-up">
            <img
              src={selectedMapItem.imageUrl}
              alt={'title' in selectedMapItem ? selectedMapItem.title : selectedMapItem.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#707974] block">
                {'yearBuilt' in selectedMapItem ? selectedMapItem.yearBuilt : selectedMapItem.priceRange}
              </span>
              <h4 className="font-display font-bold text-sm text-[#151d1a] truncate">
                {'title' in selectedMapItem ? selectedMapItem.title : selectedMapItem.name}
              </h4>
              <p className="text-xs text-[#404945] truncate">{selectedMapItem.address}</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4D3E] mt-0.5">
                <span>{selectedMapItem.distanceMeters}m</span>
                <span>·</span>
                <span className="text-[#D96B27]">Hướng {selectedMapItem.bearingDegrees}°</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectItem(selectedMapItem)}
              className="px-3.5 py-2 rounded-xl bg-[#1B4D3E] text-white font-medium text-xs hover:bg-[#003629] transition-all cursor-pointer shrink-0"
            >
              Chi tiết
            </button>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="px-4 py-2 bg-white/90 backdrop-blur-xs border-t border-[#dce6e0] flex items-center justify-between text-[11px] text-[#404945]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]" />
            <span>Di sản lịch sử</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D96B27]" />
            <span>Ẩm thực truyền thống</span>
          </div>
        </div>
        <div className="text-[10px] text-[#707974] font-mono">
          Tọa độ trung tâm: 21.033°B, 105.844°Đ
        </div>
      </div>
    </div>
  );
};
