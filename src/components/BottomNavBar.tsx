import React from 'react';
import { Compass, Camera, Map, Bookmark } from 'lucide-react';

export type TabId = 'explore' | 'sensor_ar' | 'map' | 'saved';

interface BottomNavBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  savedCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const tabs = [
    { id: 'explore' as TabId, label: 'Khám phá', icon: Compass },
    { id: 'sensor_ar' as TabId, label: 'Cảm biến & AR', icon: Camera },
    { id: 'map' as TabId, label: 'Bản đồ', icon: Map },
    { id: 'saved' as TabId, label: 'Đã lưu', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-[#c9dbd0] shadow-[0_-4px_16px_rgba(27,77,62,0.04)] px-3 py-1.5 flex items-center justify-around z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center relative transition-all duration-150 cursor-pointer ${
              isActive ? 'text-[#1B4D3E]' : 'text-[#707974] hover:text-[#151d1a]'
            }`}
          >
            {/* Active top pill indicator */}
            {isActive && (
              <span className="absolute top-0 w-8 h-1 bg-[#1B4D3E] rounded-full" />
            )}

            <div className="relative mt-1">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-[#D96B27] text-white text-[10px] font-bold rounded-full min-w-[16px] text-center leading-tight">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[11px] font-medium mt-1 tracking-tight ${isActive ? 'font-bold text-[#1B4D3E]' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
