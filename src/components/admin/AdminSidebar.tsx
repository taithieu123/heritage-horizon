import React from 'react';
import { AdminTab } from './adminTypes';
import {
  BarChart3,
  Landmark,
  UtensilsCrossed,
  Store,
  Users,
  Sliders,
  Database,
  PanelLeftClose,
  Radio,
  Sparkles,
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`bg-white border-r border-[#c9dbd0] flex flex-col justify-between shrink-0 transition-all duration-300 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#e3ece7]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#baeed9]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-display font-bold text-sm text-[#151d1a] leading-tight truncate">
                  Ký Ức & Hương Vị
                </h1>
                <p className="text-[10px] font-semibold text-[#76A286] tracking-wider uppercase truncate">
                  CMS DI SẢN & ẨM THỰC
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg text-[#707974] hover:text-[#151d1a] hover:bg-[#edf6f1] flex items-center justify-center transition-colors cursor-pointer"
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            <PanelLeftClose className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {/* Section 1: KHU VỰC QUẢN TRỊ */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-[#707974] uppercase tracking-wider mb-2">
                KHU VỰC QUẢN TRỊ
              </p>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Tổng quan Thống kê</span>}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('landmarks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'landmarks'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <Landmark className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Di tích & Địa danh</span>}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('culinary')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'culinary'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Món ăn & Thành phần</span>}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('restaurants')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'restaurants'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Store className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">Quán ăn & Xác minh</span>}
              </div>
              {!isCollapsed && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D96B27] text-white">
                  12
                </span>
              )}
            </button>
          </div>

          {/* Section 2: HỆ THỐNG */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-[#707974] uppercase tracking-wider mb-2">
                HỆ THỐNG
              </p>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'users'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Người dùng & Phân quyền</span>}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'text-[#404945] hover:bg-[#edf6f1] hover:text-[#1B4D3E]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Cài đặt Hệ thống</span>}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('database')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'database'
                  ? 'bg-[#003629] text-white shadow-xs ring-1 ring-[#baeed9]'
                  : 'text-[#1B4D3E] bg-[#edf6f1]/60 hover:bg-[#edf6f1]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Database className="w-4 h-4 shrink-0 text-[#D96B27]" />
                {!isCollapsed && <span className="truncate">Cơ sở dữ liệu MySQL</span>}
              </div>
              {!isCollapsed && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#1B4D3E] text-[#baeed9]">
                  SQL
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Live AR & Engine Status Pill */}
      <div className="p-3 border-t border-[#e3ece7]">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#edf6f1] border border-[#c9dbd0]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {!isCollapsed && (
              <span className="text-[11px] font-medium text-[#151d1a]">
                AR & GPS Engine
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-mono font-semibold text-[#1B4D3E] bg-white px-1.5 py-0.5 rounded-md border border-[#c9dbd0]/50">
              v2.4 Online
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
