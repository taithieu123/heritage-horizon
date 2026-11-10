import React from 'react';
import { Compass, Navigation, Camera, Radio, Crosshair, RefreshCw, Eye } from 'lucide-react';
import { SensorState } from '../types';

interface SensorLabCardProps {
  sensorState: SensorState;
  onUpdateBearing: (bearing: number) => void;
  onRequestGps: () => void;
  onToggleCamera: () => void;
  onOpenAR: () => void;
  isGpsLoading?: boolean;
}

export const SensorLabCard: React.FC<SensorLabCardProps> = ({
  sensorState,
  onUpdateBearing,
  onRequestGps,
  onToggleCamera,
  onOpenAR,
  isGpsLoading = false,
}) => {
  const getDirectionText = (bearing: number) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  return (
    <div className="bg-[#f0f6f2] border border-[#c9dbd0] rounded-2xl p-4 shadow-sm transition-all hover:border-[#1B4D3E]/40">
      {/* Header section */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dce6e0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] font-display">
              Phòng Thí Nghiệm Cảm Biến
            </h3>
            <p className="text-[11px] text-[#404945]">Spatial Telemetry & AR Engine</p>
          </div>
        </div>

        {/* Live bearing badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-[#76A286]/30 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#1B4D3E]" />
          <span className="text-xs font-bold text-[#1B4D3E] font-mono tabular-nums">
            {sensorState.compassBearing.toFixed(1)}°
          </span>
          <span className="text-[10px] font-medium text-[#404945]">
            ({getDirectionText(sensorState.compassBearing)})
          </span>
        </div>
      </div>

      {/* Main sensor telemetry layout */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Interactive Compass Disc */}
        <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-[#dfe8e2]">
          <div className="relative w-16 h-16 shrink-0 rounded-full border-2 border-[#1B4D3E]/20 bg-[#edf6f1] flex items-center justify-center shadow-inner overflow-hidden">
            {/* Compass degree markings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[9px] font-bold font-mono text-[#1B4D3E]">
              <span className="absolute top-0.5">N</span>
              <span className="absolute right-1">E</span>
              <span className="absolute bottom-0.5">S</span>
              <span className="absolute left-1">W</span>
            </div>

            {/* Rotating needle */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${sensorState.compassBearing}deg)` }}
            >
              <div className="w-1 h-7 bg-gradient-to-t from-transparent via-[#D96B27] to-[#D96B27] rounded-full shadow-xs" />
              <div className="absolute w-2 h-2 rounded-full bg-[#1B4D3E] border-2 border-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-[#404945] flex items-center justify-between">
              <span>Góc xoay thiết bị</span>
              <span className="font-mono text-xs font-semibold text-[#1B4D3E]">
                {sensorState.compassBearing.toFixed(1)}°
              </span>
            </div>
            {/* Interactive Compass Slider to simulate turning phone */}
            <input
              type="range"
              min="0"
              max="359"
              value={Math.round(sensorState.compassBearing)}
              onChange={(e) => onUpdateBearing(Number(e.target.value))}
              aria-label="Điều chỉnh góc la bàn"
              className="w-full mt-2 h-1.5 bg-[#dce6e0] rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
            />
            <div className="flex justify-between text-[9px] text-[#707974] mt-1 font-mono">
              <button
                type="button"
                onClick={() => onUpdateBearing(0)}
                className="hover:text-[#1B4D3E] cursor-pointer"
              >
                0° Bắc
              </button>
              <button
                type="button"
                onClick={() => onUpdateBearing(60.7)}
                className="hover:text-[#1B4D3E] font-semibold text-[#D96B27] cursor-pointer"
              >
                60.7° (Mẫu)
              </button>
              <button
                type="button"
                onClick={() => onUpdateBearing(180)}
                className="hover:text-[#1B4D3E] cursor-pointer"
              >
                180° Nam
              </button>
            </div>
          </div>
        </div>

        {/* Right: GPS Telemetry values */}
        <div className="bg-white/80 p-3 rounded-xl border border-[#dfe8e2] flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-[#707974] block">Vĩ độ (Latitude)</span>
              <span className="font-mono font-semibold text-[#151d1a] tabular-nums">
                {sensorState.coordinates.latitude.toFixed(4)}° B
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#707974] block">Kinh độ (Longitude)</span>
              <span className="font-mono font-semibold text-[#151d1a] tabular-nums">
                {sensorState.coordinates.longitude.toFixed(4)}° Đ
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#707974] block">Độ cao (Altitude)</span>
              <span className="font-mono font-semibold text-[#151d1a] tabular-nums">
                {sensorState.coordinates.altitude.toFixed(1)} m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#707974] block">Độ chính xác</span>
              <span className="font-mono font-semibold text-[#3d674e] tabular-nums">
                ±{sensorState.coordinates.accuracy.toFixed(1)} m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons matching Design Spec Section 1 (Buttons) */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-[#dce6e0]">
        <button
          type="button"
          onClick={onRequestGps}
          disabled={isGpsLoading}
          className="flex-1 min-w-[120px] h-10 px-3.5 rounded-lg bg-[rgba(118,162,134,0.18)] hover:bg-[rgba(118,162,134,0.28)] active:scale-[0.98] border border-[rgba(118,162,134,0.40)] text-[#1B4D3E] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          {isGpsLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-[#1B4D3E]" />
          )}
          <span>{isGpsLoading ? 'Đang định vị...' : 'Lấy GPS'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenAR}
          className="flex-1 min-w-[140px] h-10 px-4 rounded-lg bg-[#1B4D3E] hover:bg-[#003629] active:scale-[0.98] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Bật Camera & AR</span>
        </button>

        <button
          type="button"
          onClick={onToggleCamera}
          title="Bật/Tắt cảm biến hướng ảo"
          className="h-10 px-3 rounded-lg bg-white hover:bg-[#e7f0eb] border border-[#c0c9c3] text-[#404945] text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-[#1B4D3E]" />
          <span className="hidden sm:inline">Quét cảm biến</span>
        </button>
      </div>
    </div>
  );
};
