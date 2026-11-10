import React from 'react';
import { Search, Bell, Smartphone, ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
  onSwitchToMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lang: 'VN' | 'EN';
  onToggleLang: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onSwitchToMobile,
  searchQuery,
  onSearchChange,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="h-16 px-6 bg-white border-b border-[#c9dbd0] flex items-center justify-between gap-4 sticky top-0 z-10 shrink-0">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm di tích, công thức món, quán ăn..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] placeholder-[#707974] focus:outline-hidden focus:border-[#1B4D3E] focus:bg-white transition-colors"
        />
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Switch to Mobile App button */}
        <button
          type="button"
          onClick={onSwitchToMobile}
          className="h-9 px-3 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] border border-[#76A286]/50 text-[#1B4D3E] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          title="Chuyển sang giao diện Ứng dụng Di động & Kính ngắm AR"
        >
          <Smartphone className="w-4 h-4 text-[#D96B27]" />
          <span className="hidden sm:inline">Xem Ứng dụng Di động & AR</span>
        </button>

        {/* Language switch */}
        <div className="flex items-center bg-[#f3fbf6] p-0.5 rounded-lg border border-[#c9dbd0] text-[11px] font-semibold text-[#404945]">
          <button
            type="button"
            onClick={() => lang !== 'VN' && onToggleLang()}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              lang === 'VN' ? 'bg-white text-[#1B4D3E] shadow-2xs' : 'text-[#707974]'
            }`}
          >
            VN
          </button>
          <button
            type="button"
            onClick={() => lang !== 'EN' && onToggleLang()}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              lang === 'EN' ? 'bg-white text-[#1B4D3E] shadow-2xs' : 'text-[#707974]'
            }`}
          >
            EN
          </button>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative w-9 h-9 rounded-xl bg-[#f3fbf6] hover:bg-[#edf6f1] border border-[#c9dbd0] flex items-center justify-center text-[#404945] transition-colors cursor-pointer"
          title="Thông báo mới (3)"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D96B27] ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#c9dbd0]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#151d1a] leading-tight">
              Minh Quân
            </p>
            <p className="text-[10px] text-[#707974] leading-tight font-medium">
              Super Admin
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center text-xs font-bold border border-[#baeed9]/40 shadow-xs">
            MQ
          </div>
        </div>
      </div>
    </header>
  );
};
