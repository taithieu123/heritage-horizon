import React, { useState, useEffect } from 'react';
import {
  ADMIN_STATS,
  URGENT_VERIFICATION_TASKS,
  CALIBRATION_ALERTS,
  ADMIN_ACTIVITY_LOGS,
} from './adminMockData';
import {
  UrgentVerificationTask,
  CalibrationAlert,
  AdminActivityLog,
} from './adminTypes';
import {
  Landmark,
  UtensilsCrossed,
  Store,
  Compass,
  Download,
  AlertTriangle,
  History,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Sparkles,
  Layers,
  Clock,
  Radio,
  FileCheck,
} from 'lucide-react';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
  onOpenCalibrationModal?: (alertId: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | 'month' | '2025'>('month');
  const [stats, setStats] = useState(ADMIN_STATS);
  const [tasks, setTasks] = useState<UrgentVerificationTask[]>(URGENT_VERIFICATION_TASKS);
  const [alerts, setAlerts] = useState<CalibrationAlert[]>(CALIBRATION_ALERTS);
  const [logs, setLogs] = useState<AdminActivityLog[]>(ADMIN_ACTIVITY_LOGS);
  const [quickApprovedIds, setQuickApprovedIds] = useState<string[]>([]);
  const [calibratedIds, setCalibratedIds] = useState<string[]>([]);

  // Fetch real-time data from database
  const fetchDbData = () => {
    fetch('/api/database/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats((prev) => ({
            ...prev,
            ...json.data,
          }));
          if (json.data.urgentTasks && Array.isArray(json.data.urgentTasks)) {
            setTasks(json.data.urgentTasks);
          }
          if (json.data.calibrationAlerts && Array.isArray(json.data.calibrationAlerts)) {
            setAlerts(json.data.calibrationAlerts);
          }
          if (json.data.activityLogs && Array.isArray(json.data.activityLogs)) {
            setLogs(json.data.activityLogs);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  const handleQuickApprove = (id: string) => {
    fetch(`/api/database/tasks/${id}/verify`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setQuickApprovedIds((prev) => [...prev, id]);
          fetchDbData();
        }
      })
      .catch(() => {
        setQuickApprovedIds((prev) => [...prev, id]);
      });
  };

  const handleCalibrate = (id: string) => {
    fetch(`/api/database/calibration-alerts/${id}/resolve`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCalibratedIds((prev) => [...prev, id]);
          fetchDbData();
        }
      })
      .catch(() => {
        setCalibratedIds((prev) => [...prev, id]);
      });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-[#76A286] tracking-wider uppercase font-mono">
              TRUNG TÂM ĐIỀU HÀNH SỐ HÓA
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#151d1a]">
            Tổng quan Hệ thống Quản trị Travel Heritage
          </h1>
          <p className="text-xs text-[#707974] mt-0.5">
            Giám sát hạ tầng dữ liệu di tích, ẩm thực truyền thống, định vị GPS & tương tác AR thời gian thực.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#c9dbd0] text-xs font-semibold text-[#404945] shadow-2xs">
            <button
              type="button"
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'today' ? 'bg-[#1B4D3E] text-white shadow-2xs' : 'hover:bg-[#edf6f1]'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === '7days' ? 'bg-[#1B4D3E] text-white shadow-2xs' : 'hover:bg-[#edf6f1]'
              }`}
            >
              7 ngày qua
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'month' ? 'bg-[#1B4D3E] text-white shadow-2xs' : 'hover:bg-[#edf6f1]'
              }`}
            >
              Tháng này
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('2025')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === '2025' ? 'bg-[#1B4D3E] text-white shadow-2xs' : 'hover:bg-[#edf6f1]'
              }`}
            >
              Năm 2025
            </button>
          </div>

          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Di tích hoạt động */}
        <div
          onClick={() => onNavigateTab('landmarks')}
          className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs hover:border-[#1B4D3E]/40 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              DI TÍCH HOẠT ĐỘNG
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display font-extrabold text-3xl text-[#151d1a]">
              {stats.landmarksActive}
            </span>
            <span className="text-xs text-[#707974] font-medium">địa danh</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#707974] pt-2 border-t border-[#edf6f1]">
            <span className="text-[#1B4D3E] font-semibold">+{stats.landmarksNew3D} mô hình 3D mới</span>
            <span>•</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">
              Tăng {stats.landmarksGrowthPercent}%
            </span>
          </div>
        </div>

        {/* Card 2: Món ăn & thành phần */}
        <div
          onClick={() => onNavigateTab('culinary')}
          className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs hover:border-[#1B4D3E]/40 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              MÓN ĂN & THÀNH PHẦN
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#D96B27] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display font-extrabold text-3xl text-[#151d1a]">
              {stats.culinaryItems}
            </span>
            <span className="text-xs text-[#707974] font-medium">món di sản</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#707974] pt-2 border-t border-[#edf6f1]">
            <span className="text-[#D96B27] font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {stats.culinaryAllergens.toLocaleString()} cảnh báo FR08
            </span>
            <span>•</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">
              Đã lọc an toàn
            </span>
          </div>
        </div>

        {/* Card 3: Quán ăn & ẩm thực */}
        <div
          onClick={() => onNavigateTab('restaurants')}
          className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs hover:border-[#1B4D3E]/40 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              QUÁN ĂN & ẨM THỰC
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display font-extrabold text-3xl text-[#151d1a]">
              {stats.restaurantsTotal}
            </span>
            <span className="text-xs text-[#707974] font-medium">điểm bán</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#707974] pt-2 border-t border-[#edf6f1]">
            <span className="text-amber-700 font-semibold">{stats.restaurantsPending} quán chờ duyệt</span>
            <span>•</span>
            <span className="text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-md font-bold">
              Ưu tiên xử lý
            </span>
          </div>
        </div>

        {/* Card 4: Quét AR & Truy cập App */}
        <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              QUÉT AR & TRUY CẬP APP
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display font-extrabold text-3xl text-[#151d1a]">
              {ADMIN_STATS.arScansTotal.toLocaleString()}
            </span>
            <span className="text-xs text-[#707974] font-medium">phiên</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#707974] pt-2 border-t border-[#edf6f1]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{ADMIN_STATS.arScansGrowthPercent}% tăng trưởng
            </span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Tỉ lệ giữ chân {ADMIN_STATS.retentionRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Row: 30-Day Trend Area Chart & Structure Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Area Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#76A286] uppercase">
                    TẦN SUẤT TƯƠNG TÁC TRỰC QUAN
                  </span>
                  <span className="text-[10px] font-semibold text-[#1B4D3E] bg-[#edf6f1] px-2 py-0.5 rounded-full">
                    30 Ngày Qua
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[#151d1a] mt-0.5">
                  Xu hướng quét AR Di tích & Tra cứu Ẩm thực
                </h3>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]" />
                  <span className="text-[#404945]">Quét AR 3D</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D96B27]" />
                  <span className="text-[#404945]">Tra cứu Ẩm thực</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Smooth Area Chart */}
            <div className="relative w-full h-56 pt-2">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="arGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D96B27" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#D96B27" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f0f5f2" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#f0f5f2" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#f0f5f2" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="185" x2="600" y2="185" stroke="#e3ece7" strokeWidth="1" />

                {/* Area 1: Food lookup */}
                <path
                  d="M 0 160 C 60 150, 120 142, 180 135 C 240 128, 300 115, 360 110 C 420 105, 480 88, 540 80 C 570 76, 590 72, 600 70 L 600 185 L 0 185 Z"
                  fill="url(#foodGradient)"
                />
                <path
                  d="M 0 160 C 60 150, 120 142, 180 135 C 240 128, 300 115, 360 110 C 420 105, 480 88, 540 80 C 570 76, 590 72, 600 70"
                  fill="none"
                  stroke="#D96B27"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Area 2: AR 3D scanning */}
                <path
                  d="M 0 150 C 60 135, 120 120, 180 100 C 240 80, 300 75, 360 60 C 420 50, 480 42, 540 35 C 570 32, 590 30, 600 28 L 600 185 L 0 185 Z"
                  fill="url(#arGradient)"
                />
                <path
                  d="M 0 150 C 60 135, 120 120, 180 100 C 240 80, 300 75, 360 60 C 420 50, 480 42, 540 35 C 570 32, 590 30, 600 28"
                  fill="none"
                  stroke="#1B4D3E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Keypoint Markers */}
                <circle cx="180" cy="100" r="4" fill="#ffffff" stroke="#1B4D3E" strokeWidth="2.5" />
                <circle cx="360" cy="60" r="4" fill="#ffffff" stroke="#1B4D3E" strokeWidth="2.5" />
                <circle cx="540" cy="35" r="4" fill="#ffffff" stroke="#1B4D3E" strokeWidth="2.5" />
                <circle cx="600" cy="28" r="5" fill="#baeed9" stroke="#1B4D3E" strokeWidth="3" />

                <circle cx="540" cy="80" r="3.5" fill="#ffffff" stroke="#D96B27" strokeWidth="2" />
                <circle cx="600" cy="70" r="4.5" fill="#ffcca8" stroke="#D96B27" strokeWidth="2.5" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-[#707974] pt-2">
                <span>Ngày 01</span>
                <span>Ngày 06</span>
                <span>Ngày 12</span>
                <span>Ngày 18</span>
                <span>Ngày 24</span>
                <span className="text-[#1B4D3E] font-bold">Hôm nay (Ngày 30)</span>
              </div>
            </div>
          </div>

          {/* 4 Bottom Mini Metrics matching design */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-4 border-t border-[#edf6f1]">
            <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
              <span className="text-[10px] text-[#707974] block uppercase font-medium">
                Cao điểm quét trong ngày
              </span>
              <span className="font-display font-bold text-sm text-[#151d1a]">
                09:30 & 16:45
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
              <span className="text-[10px] text-[#707974] block uppercase font-medium">
                Di tích AR nhiều nhất
              </span>
              <span className="font-display font-bold text-sm text-[#151d1a] truncate block">
                Hoàng thành Thăng Long
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
              <span className="text-[10px] text-[#707974] block uppercase font-medium">
                Món tra cứu hàng đầu
              </span>
              <span className="font-display font-bold text-sm text-[#151d1a] truncate block">
                Phở Bò Nam Định
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
              <span className="text-[10px] text-[#707974] block uppercase font-medium">
                Độ trễ GPS/AR trung bình
              </span>
              <span className="font-display font-bold text-sm text-emerald-700">
                42ms (Rất tốt)
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Structure Distribution & Allergen Warnings */}
        <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-[#76A286] uppercase">
                THỐNG KÊ CẤU TRÚC PHÂN LOẠI
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-[#151d1a]">
              Phân bổ Danh mục & Cảnh báo
            </h3>
          </div>

          {/* Section: Phân loại Di tích */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#151d1a]">Phân loại Di tích (128 điểm)</span>
              <Landmark className="w-3.5 h-3.5 text-[#76A286]" />
            </div>

            {/* Segmented bar */}
            <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
              <div style={{ width: '45%' }} className="bg-[#1B4D3E] transition-all" title="Lịch sử: 45%" />
              <div style={{ width: '30%' }} className="bg-[#76A286] transition-all" title="Kiến trúc: 30%" />
              <div style={{ width: '25%' }} className="bg-[#baeed9] transition-all" title="Danh thắng: 25%" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#707974] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1B4D3E]" />
                <span>Lịch sử 45%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#76A286]" />
                <span>Kiến trúc 30%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#baeed9]" />
                <span>Danh thắng 25%</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#edf6f1]" />

          {/* Section: Dị ứng FR08 kích hoạt nhiều nhất */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#151d1a]">Dị ứng FR08 kích hoạt nhiều nhất</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#D96B27]" />
            </div>

            <div className="space-y-2.5">
              {/* Item 1 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#151d1a]">Mắm tôm / Hải sản lên men</span>
                  <span className="font-bold text-[#D96B27]">42% (521 lượt)</span>
                </div>
                <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
                  <div style={{ width: '42%' }} className="h-full bg-[#D96B27] rounded-full" />
                </div>
              </div>

              {/* Item 2 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#151d1a]">Đậu phộng / Lạc</span>
                  <span className="font-bold text-amber-700">28% (347 lượt)</span>
                </div>
                <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                  <div style={{ width: '28%' }} className="h-full bg-amber-500 rounded-full" />
                </div>
              </div>

              {/* Item 3 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#151d1a]">Gluten / Bột mì</span>
                  <span className="font-bold text-[#1B4D3E]">18% (223 lượt)</span>
                </div>
                <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <div style={{ width: '18%' }} className="h-full bg-[#1B4D3E] rounded-full" />
                </div>
              </div>

              {/* Item 4 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#151d1a]">Thành phần khác</span>
                  <span className="font-bold text-[#707974]">12% (149 lượt)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div style={{ width: '12%' }} className="h-full bg-[#707974] rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#707974]">Cập nhật tự động theo API Gateway</span>
              <button
                type="button"
                onClick={() => onNavigateTab('culinary')}
                className="text-[#1B4D3E] font-bold hover:underline flex items-center gap-0.5"
              >
                Xem chi tiết FR08 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Urgent Tasks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Tasks & AR Calibration Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Verification Tasks Table */}
          <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D96B27]" />
                  <span className="text-[10px] font-mono font-bold text-[#D96B27] uppercase">
                    NHIỆM VỤ CẤP BÁCH
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[#151d1a]">
                  Yêu cầu xác minh quán ăn & Hiệu chuẩn AR
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-[#D96B27] border border-orange-200">
                  5 yêu cầu mới
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  2 lỗi hiệu chuẩn
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3ece7] text-[10px] uppercase font-bold text-[#707974] tracking-wider">
                    <th className="pb-2.5 font-semibold">QUÁN ĂN & VỊ TRÍ</th>
                    <th className="pb-2.5 font-semibold">MÓN ĐẶC SẢN</th>
                    <th className="pb-2.5 font-semibold text-right">TRẠNG THÁI & XỬ LÝ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf6f1]">
                  {tasks.map((task) => {
                    const isApproved = quickApprovedIds.includes(task.id);
                    return (
                      <tr key={task.id} className="hover:bg-[#f8faf9] transition-colors">
                        {/* Cột 1: Quán ăn & Vị trí (Địa chỉ + Tọa độ GPS gộp) */}
                        <td className="py-2.5 pr-2">
                          <p className="font-bold text-[#151d1a]">{task.name}</p>
                          <p className="text-[10px] text-[#707974] truncate max-w-xs">
                            {task.address} • <span className="font-mono text-[9px] text-[#1B4D3E]">{task.coords}</span>
                          </p>
                        </td>

                        {/* Cột 2: Món đặc sản */}
                        <td className="py-2.5 pr-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#edf6f1] text-[#1B4D3E] font-medium text-[11px]">
                            {task.dishName}
                          </span>
                        </td>

                        {/* Cột 3: Trạng thái & Nút hành động gộp */}
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isApproved ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Đã duyệt
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleQuickApprove(task.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#1B4D3E] text-white hover:bg-[#003629] text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Duyệt nhanh
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onNavigateTab('restaurants')}
                              className="px-2 py-1 rounded-lg bg-[#edf6f1] text-[#1B4D3E] hover:bg-[#dce6e0] text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Chi tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calibration Alerts Sub-card */}
            <div className="mt-5 pt-5 border-t border-[#edf6f1] space-y-3">
              <span className="text-[11px] font-bold text-rose-700 tracking-wide uppercase font-mono block">
                CẢNH BÁO SAI SỐ KHÔNG GIAN (CẦN HIỆU CHUẨN AR ENGINE)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alerts.map((alert) => {
                  const isDone = calibratedIds.includes(alert.id) || (alert as any).resolved;
                  return (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <h4 className="font-bold text-xs text-[#151d1a]">
                            {alert.landmarkName}
                          </h4>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-800 shrink-0">
                          {alert.errorDesc} {alert.errorDelta}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#404945] leading-relaxed">
                        {alert.viewportDesc}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleCalibrate(alert.id)}
                          disabled={isDone}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                          }`}
                        >
                          {isDone ? '✓ Đã hiệu chuẩn' : alert.actionText}
                        </button>
                        <span className="text-[10px] text-[#707974]">
                          Báo cáo bởi {alert.reportedByUsers} người dùng
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Feed */}
        <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#76A286] uppercase block">
                  NHẬT KÝ HOẠT ĐỘNG
                </span>
                <h3 className="font-display font-bold text-base text-[#151d1a]">
                  Hoạt động Quản trị gần đây
                </h3>
              </div>
              <History className="w-4 h-4 text-[#707974]" />
            </div>

            {/* Activity Stream */}
            <div className="relative pl-4 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#edf6f1]">
              {logs.map((log) => (
                <div key={log.id} className="relative space-y-1">
                  <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-[#1B4D3E] ring-4 ring-white" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#151d1a]">
                      {log.userName}{' '}
                      <span className="text-[10px] font-normal text-[#707974]">
                        ({log.userRole})
                      </span>
                    </span>
                    <span className="text-[10px] text-[#707974]">{log.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    {log.actionDesc}
                  </p>
                  {log.tags && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {log.tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded-md bg-[#edf6f1] text-[#1B4D3E] font-mono text-[9px] font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#edf6f1] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#707974]">
              Tổng số 128 bản ghi nhật ký hôm nay
            </span>
            <button
              type="button"
              className="text-[#1B4D3E] font-bold hover:underline text-[11px]"
            >
              Xem toàn bộ log →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#c9dbd0] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#151d1a]">Bản đồ Di sản Tương tác</h4>
            <p className="text-[11px] text-[#707974]">
              Trực quan hóa bản đồ nhiệt (Heatmap) du khách ghé thăm theo thời gian thực.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c9dbd0] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#151d1a]">Hạ tầng AR Engine v2.4</h4>
            <p className="text-[11px] text-[#707974]">
              Hiệu năng máy chủ nhận dạng không gian đạt 99.98% SLA trong tháng.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c9dbd0] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D96B27] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#151d1a]">Bảo vệ Du khách FR08</h4>
            <p className="text-[11px] text-[#707974]">
              0 trường hợp sốc phản vệ ghi nhận sau khi triển khai hệ thống cảnh báo sớm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
