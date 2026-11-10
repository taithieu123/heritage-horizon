import React from 'react';
import { Volume2, MapPin, Bookmark, Sparkles, Navigation } from 'lucide-react';
import { HeritageItem } from '../types';

interface HeritageCardProps {
  item: HeritageItem;
  isSaved: boolean;
  onSelect: (item: HeritageItem) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onPlayAudio: (item: HeritageItem, e: React.MouseEvent) => void;
  isPlayingThisAudio?: boolean;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({
  item,
  isSaved,
  onSelect,
  onToggleSave,
  onPlayAudio,
  isPlayingThisAudio = false,
}) => {
  return (
    <article
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl border border-[rgba(118,162,134,0.18)] shadow-[0_4px_16px_-2px_rgba(27,77,62,0.06)] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_-4px_rgba(27,77,62,0.12)] hover:border-[#1B4D3E]/30 flex flex-col"
    >
      {/* High-bleed landscape photo with rounded top */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e2eae5]">
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Elegant gradient fallback
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Gradient scrim for daylight legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Distance chip (e.g. 250m) */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xs flex items-center gap-1.5 text-xs font-semibold text-[#1B4D3E]">
          <Navigation className="w-3 h-3 text-[#1B4D3E]" />
          <span>{item.distanceMeters}m</span>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => onToggleSave(item.id, e)}
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu địa danh'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-[#1B4D3E] text-white shadow-md'
              : 'bg-white/80 text-[#232B28] hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Audio tour badge on image bottom right */}
        {item.hasAudioTour && (
          <button
            type="button"
            onClick={(e) => onPlayAudio(item, e)}
            className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
              isPlayingThisAudio
                ? 'bg-[#D96B27] text-white animate-pulse'
                : 'bg-white/95 text-[#1B4D3E] hover:bg-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingThisAudio ? 'Đang phát tour' : `Tour thoại (${item.audioDurationMinutes}p)`}</span>
          </button>
        )}

        {/* Compass bearing tag */}
        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
          Góc: {item.bearingDegrees}°
        </div>
      </div>

      {/* White lower container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-[#707974] mb-1">
            <span>{item.yearBuilt}</span>
            <span aria-hidden="true">·</span>
            <span>{item.era}</span>
          </div>

          <h3 className="font-display font-semibold text-base text-[#151d1a] leading-tight group-hover:text-[#1B4D3E] transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-[#404945] mt-1.5 line-clamp-2 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Address and action preview */}
        <div className="mt-3 pt-3 border-t border-[#edf6f1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#707974] truncate max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#76A286]" />
            <span className="truncate">{item.address}</span>
          </div>
          <span className="text-[#1B4D3E] font-medium group-hover:underline">Chi tiết &rarr;</span>
        </div>
      </div>
    </article>
  );
};
