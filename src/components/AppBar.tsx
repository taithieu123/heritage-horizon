import React from 'react';
import { Compass, Camera, Smartphone, Monitor, Search, Sparkles, Navigation, X, QrCode } from 'lucide-react';

interface AppBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenAR: () => void;
  onOpenPhoneModal: () => void;
  compassBearing: number;
  onSwitchToAdmin?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  searchQuery,
  onSearchChange,
  isMobileFrame,
  onToggleFrame,
  onOpenAR,
  onOpenPhoneModal,
  compassBearing,
  onSwitchToAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#c9dbd0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#1B4D3E] flex items-center justify-center text-white shadow-xs">
            <Compass className="w-5 h-5 text-[#baeed9]" />
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-base sm:text-lg text-[#151d1a] tracking-tight whitespace-nowrap block">
              Heritage & Horizon
            </span>
            <span className="text-[11px] text-[#707974] hidden sm:block whitespace-nowrap">
              Khám Phá Di Sản & AR Không Gian
            </span>
          </div>
        </div>

        {/* Zone 2: Exploration Search Bar matching Design Spec */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Navigation className="absolute left-3.5 w-4 h-4 text-[#76A286] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm di tích, chùa cổ, phở Bát Đàn, chả cá..."
              className="w-full h-10 pl-10 pr-9 rounded-2xl bg-[#edf6f1] border border-transparent focus:border-[#1B4D3E] focus:bg-white text-xs text-[#151d1a] placeholder-[#707974] transition-all outline-hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-[#707974] hover:text-[#151d1a]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAR}
                title="Khởi động AR tìm kiếm"
                className="absolute right-3 text-[#1B4D3E] hover:text-[#003629]"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Actions & Mobile Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Compass bearing pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edf6f1] border border-[#c9dbd0] text-xs font-mono text-[#1B4D3E]">
            <Compass className="w-3.5 h-3.5 text-[#D96B27]" />
            <span className="font-bold tabular-nums">{compassBearing.toFixed(1)}°</span>
          </div>

          {/* Open on Real Phone Modal Trigger */}
          <button
            type="button"
            onClick={onOpenPhoneModal}
            className="h-9 px-3 rounded-xl bg-[#D96B27] hover:bg-[#b85418] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
            title="Quét mã QR để mở trực tiếp trên điện thoại thật"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Chạy trên điện thoại</span>
          </button>

          {/* Admin CMS Portal Toggle Button */}
          {onSwitchToAdmin && (
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="h-9 px-3 rounded-xl bg-[#003629] hover:bg-[#1B4D3E] text-[#baeed9] border border-[#76A286]/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
              title="Mở Trang Quản trị Di sản & Cơ sở dữ liệu MySQL"
            >
              <Sparkles className="w-4 h-4 text-[#baeed9]" />
              <span className="hidden md:inline">CMS Quản Trị</span>
            </button>
          )}

          {/* AR Camera Quick Button */}
          <button
            type="button"
            onClick={onOpenAR}
            className="h-9 px-3 sm:px-3.5 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">AR Viewport</span>
          </button>

          {/* Toggle Flutter Device Frame vs Edge-to-Edge */}
          <button
            type="button"
            onClick={onToggleFrame}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] text-[#1B4D3E] border border-[#c9dbd0] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isMobileFrame ? 'Chuyển sang chế độ Toàn màn hình' : 'Chuyển sang khung giả lập Flutter Mobile'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-[#1B4D3E]" />
                <span className="hidden sm:inline">Toàn Màn Hình</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#1B4D3E]" />
                <span className="hidden sm:inline">Khung Flutter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
