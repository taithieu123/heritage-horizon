import React, { useState, useEffect } from 'react';
import { AdminTab, AdminLandmarkRecord } from './adminTypes';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminLandmarksTab } from './AdminLandmarksTab';
import { AdminRestaurantsTab } from './AdminRestaurantsTab';
import { AdminCulinaryTab } from './AdminCulinaryTab';
import { AdminDatabaseTab } from './AdminDatabaseTab';
import { Users, Sliders, ShieldCheck, Database, Smartphone } from 'lucide-react';

interface AdminLayoutProps {
  onSwitchToMobile: () => void;
  onOpenARModal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onSwitchToMobile,
  onOpenARModal,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'VN' | 'EN'>('VN');
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/database/users')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setDbUsers(json.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f3fbf6] flex text-[#151d1a] antialiased">
      {/* Left Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <AdminHeader
          onSwitchToMobile={onSwitchToMobile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          lang={language}
          onToggleLang={() => setLanguage(language === 'VN' ? 'EN' : 'VN')}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {currentTab === 'overview' && (
            <AdminOverviewTab
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'landmarks' && (
            <AdminLandmarksTab
              onOpenARPreview={(lm) => {
                onOpenARModal?.();
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'restaurants' && (
            <AdminRestaurantsTab />
          )}

          {currentTab === 'culinary' && (
            <AdminCulinaryTab />
          )}

          {currentTab === 'database' && (
            <AdminDatabaseTab />
          )}

          {currentTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#151d1a]">
                    Người dùng & Phân quyền Quản trị (RBAC)
                  </h1>
                  <p className="text-xs text-[#707974] mt-0.5">
                    Dữ liệu tài khoản thời gian thực lấy trực tiếp từ bảng <code>users</code> của cơ sở dữ liệu
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dbUsers.map((u, idx) => {
                  const initials = u.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  const colors = [
                    'bg-[#1B4D3E] text-white',
                    'bg-orange-600 text-white',
                    'bg-blue-600 text-white',
                    'bg-purple-600 text-white',
                    'bg-emerald-600 text-white',
                  ];
                  const avatarColor = colors[idx % colors.length];

                  return (
                    <div key={u.id} className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
                      <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center font-bold text-sm shadow-xs`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#151d1a]">{u.full_name}</h3>
                        <p className="text-xs text-[#1B4D3E] font-semibold mt-0.5">{u.role}</p>
                        <p className="text-[11px] text-[#707974] mt-1 font-mono">{u.email}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#edf6f1]">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {u.status || 'Active'}
                        </span>
                        <span className="text-[10px] text-[#707974] font-mono">ID: {u.id}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-6 max-w-2xl">
              <div>
                <h1 className="font-display font-bold text-xl text-[#151d1a]">
                  Cài đặt Hệ thống Quản trị Travel Heritage
                </h1>
                <p className="text-xs text-[#707974] mt-0.5">
                  Cấu hình tần số làm tươi AR, bán kính định vị GPS và kết nối máy chủ MySQL
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#151d1a]">Tần số làm tươi AR Viewfinder</h4>
                    <p className="text-[11px] text-[#707974]">Mặc định: 60Hz cho camera phần cứng di động</p>
                  </div>
                  <span className="font-mono font-bold text-[#1B4D3E]">60 FPS</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#151d1a]">Sai số GPS cho phép để cấp tích xanh</h4>
                    <p className="text-[11px] text-[#707974]">Ngưỡng cảnh báo thực địa: 5.0 mét</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">≤ ±2.5m (RTK)</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#151d1a]">Cơ sở dữ liệu MySQL</h4>
                    <p className="text-[11px] text-[#707974]">Tên Schema: <code>heritage_horizon_db</code></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('database')}
                    className="px-3 py-1.5 rounded-lg bg-[#1B4D3E] text-white text-xs font-semibold"
                  >
                    Xem SQL Script
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
