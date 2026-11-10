import React from 'react';
import { Flame, MapPin, Bookmark, Utensils, Navigation } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  isSaved: boolean;
  onSelect: (item: FoodItem) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  isSaved,
  onSelect,
  onToggleSave,
}) => {
  return (
    <article
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl border border-[rgba(118,162,134,0.18)] shadow-[0_4px_16px_-2px_rgba(27,77,62,0.06)] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_-4px_rgba(27,77,62,0.12)] hover:border-[#D96B27]/40 flex flex-col"
    >
      {/* Food Photo Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#edf6f1]">
        <img
          src={item.imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Distance Chip */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xs flex items-center gap-1.5 text-xs font-semibold text-[#1B4D3E]">
          <Navigation className="w-3 h-3 text-[#1B4D3E]" />
          <span>{item.distanceMeters}m</span>
        </div>

        {/* Terracotta / Spice Rating Badge pinned to the top-right (#D96B27) */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#D96B27] text-white shadow-md flex items-center gap-1 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{item.spiceLabel}</span>
        </div>

        {/* Save button floating */}
        <button
          type="button"
          onClick={(e) => onToggleSave(item.id, e)}
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu quán ăn'}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-[#D96B27] text-white'
              : 'bg-white/80 text-[#232B28] hover:bg-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay on image */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white font-mono text-xs font-semibold">
          {item.priceRange}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h3 className="font-display font-semibold text-base text-[#151d1a] leading-tight group-hover:text-[#D96B27] transition-colors">
            {item.name}
          </h3>

          <p className="text-xs text-[#404945] mt-1 line-clamp-1 italic">
            "{item.specialtyName}"
          </p>

          {/* Flavor profile tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {item.flavorTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#edf6f1] text-[#1B4D3E] text-[11px] font-medium border border-[#c9dbd0]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Address and explore link */}
        <div className="mt-3 pt-3 border-t border-[#edf6f1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#707974] truncate max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#D96B27]" />
            <span className="truncate">{item.address}</span>
          </div>
          <span className="text-[#D96B27] font-medium group-hover:underline">Thưởng thức &rarr;</span>
        </div>
      </div>
    </article>
  );
};
