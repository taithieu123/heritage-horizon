import React, { useState, useEffect } from 'react';
import { ADMIN_RESTAURANTS } from './adminMockData';
import { AdminRestaurantRecord } from './adminTypes';
import {
  Store,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck,
  MapPin,
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Download,
  Search,
  Check,
  Radio,
  Sparkles,
  Database,
} from 'lucide-react';

export const AdminRestaurantsTab: React.FC = () => {
  const [restaurants, setRestaurants] = useState<AdminRestaurantRecord[]>(ADMIN_RESTAURANTS);
  const [selectedRes, setSelectedRes] = useState<AdminRestaurantRecord>(ADMIN_RESTAURANTS[0]);
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'verified' | 'need_inspect'>('pending');
  const [approvedIds, setApprovedIds] = useState<string[]>(['res-3']);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDbSynced, setIsDbSynced] = useState(true);

  // Fetch real-time data from database API
  const fetchDbRestaurants = () => {
    fetch('/api/database/restaurants')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          const mapped: AdminRestaurantRecord[] = json.data.map((r: any) => ({
            id: r.id,
            code: r.code,
            name: r.name,
            ownerName: r.owner_name,
            supervisor: 'Trần Quốc Toản',
            address: r.location.split('|')[0]?.trim() || r.location,
            coordsFormatted: r.location.split('|')[1]?.trim() || '21.0189, 105.8532',
            lat: 21.0189,
            lng: 105.8532,
            gpsAccuracy: 'Sai số: ±1.1m (RTK Tốt)',
            dishName: r.specialty_dish.split('(')[0]?.trim() || r.specialty_dish,
            dishTag: r.specialty_dish.includes('(') ? r.specialty_dish.split('(')[1]?.replace(')', '') : 'Đặc sản gia truyền',
            dishIngredients: 'Nguyên liệu sạch chọn lọc, công thức gia truyền',
            auditPassed: r.audit_passed || '3/3 Tiêu chí đạt',
            status: r.verification_status === 'Verified' ? 'verified' : (r.verification_status === 'Need Inspection' ? 'need_inspect' : 'pending'),
            statusLabel: r.verification_status,
            arMatchingPercent: r.ar_matching_percent || 99,
            geofenceNearName: 'Văn Miếu 200m, Hồ Gươm 650m',
            geofenceNearDist: 'R: 350m AR Buffer',
            safetyLicenseImg: '/src/assets/images/bun_cha_1793939031267.jpg',
            facadeImg: '/src/assets/images/ar_hanoi_view_1793939014182.jpg',
          }));
          setRestaurants(mapped);
          setIsDbSynced(true);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchDbRestaurants();
  }, []);

  // Handle Approve action with Database persistence
  const handleApprove = (res: AdminRestaurantRecord) => {
    fetch(`/api/database/restaurants/${res.id}/verify`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setApprovedIds((prev) => [...prev, res.id]);
          fetchDbRestaurants();
        }
      })
      .catch(() => {
        setApprovedIds((prev) => [...prev, res.id]);
      });

    setToastMessage(`Đã ký duyệt thành công cơ sở "${res.name}" vào Database! Dữ liệu đã đồng bộ trực tiếp lên App Mobile & Bản đồ AR qua WebSocket.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  };

  const filteredList = restaurants.filter((r) => {
    if (activeFilterTab === 'all') return true;
    if (activeFilterTab === 'pending') return r.status === 'pending' && !approvedIds.includes(r.id);
    if (activeFilterTab === 'verified') return r.status === 'verified' || approvedIds.includes(r.id);
    if (activeFilterTab === 'need_inspect') return r.status === 'need_inspect';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#1B4D3E] text-white p-4 rounded-2xl shadow-xl border border-[#baeed9]/40 flex items-start gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#baeed9] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs">Phát hành Thẩm định Thành công!</h4>
            <p className="text-[11px] text-white/90 mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#76A286] mb-1">
            <span>CMS HỆ THỐNG</span>
            <span>&gt;</span>
            <span>ẨM THỰC DI SẢN</span>
            <span>&gt;</span>
            <span className="text-[#1B4D3E] font-bold">QUY TRÌNH THẨM ĐỊNH FR11</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#151d1a]">
            Quản Lý Cơ sở Ẩm thực & Thẩm định Xác minh Dữ liệu
          </h1>
          <p className="text-xs text-[#707974] mt-0.5 max-w-3xl">
            Chuẩn hóa vị trí thực địa, đối chiếu bán kính di tích văn hóa và cấp huy hiệu chứng nhận di sản số cho các quán ăn địa phương trên bản đồ AR di động.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#edf6f1] border border-[#c9dbd0] text-[#1B4D3E] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#76A286]" />
            <span>Xuất báo cáo Thẩm định</span>
          </button>

          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm cơ sở chỉ định</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider">
              TỔNG CƠ SỞ DỮ LIỆU
            </span>
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#404945] flex items-center justify-center">
              <Store className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-[#151d1a]">612</span>
            <span className="text-xs text-[#707974]">quán</span>
            <span className="text-[11px] text-emerald-700 font-semibold ml-auto">↗ +14 tháng này</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="w-4/5 h-full bg-[#1B4D3E] rounded-full" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider">
              CHỜ XÁC MINH THỰC ĐỊA
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#D96B27] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-[#D96B27]">48</span>
            <span className="text-xs text-[#707974]">hồ sơ mới</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D96B27] text-white ml-auto">
              Cần xử lý
            </span>
          </div>
          <div className="w-full h-1.5 bg-orange-100 rounded-full mt-3 overflow-hidden">
            <div className="w-1/2 h-full bg-[#D96B27] rounded-full" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider">
              ĐÃ CẤP TÍCH XANH (VERIFIED)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-emerald-700">542</span>
            <span className="text-xs text-[#707974]">chuẩn AR & GPS</span>
            <span className="text-[11px] text-emerald-700 font-semibold ml-auto">88.5% hoàn tất</span>
          </div>
          <div className="w-full h-1.5 bg-emerald-100 rounded-full mt-3 overflow-hidden">
            <div className="w-[88%] h-full bg-emerald-600 rounded-full" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider">
              KHIẾU NẠI / TẠM DỪNG
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-rose-700">22</span>
            <span className="text-xs text-[#707974]">cần đối soát</span>
            <span className="text-[10px] text-rose-700 font-bold ml-auto">Sai lệch GPS &gt; 50m</span>
          </div>
          <div className="w-full h-1.5 bg-rose-100 rounded-full mt-3 overflow-hidden">
            <div className="w-1/6 h-full bg-rose-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#c9dbd0] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilterTab === 'all'
                ? 'bg-[#1B4D3E] text-white shadow-2xs'
                : 'text-[#404945] hover:bg-[#edf6f1]'
            }`}
          >
            Tất cả quán (612)
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterTab === 'pending'
                ? 'bg-[#D96B27] text-white shadow-2xs'
                : 'text-[#404945] hover:bg-[#edf6f1]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Chờ thẩm định (48)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterTab('verified')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterTab === 'verified'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-[#404945] hover:bg-[#edf6f1]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã xác thực (Verified) (542)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterTab('need_inspect')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilterTab === 'need_inspect'
                ? 'bg-[#1B4D3E] text-white shadow-2xs'
                : 'text-[#404945] hover:bg-[#edf6f1]'
            }`}
          >
            Cần bổ sung hồ sơ
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#76A286] px-2 shrink-0">
          <Radio className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lưới định vị RTK: Sai số ±1.4m</span>
        </div>
      </div>

      {/* Main Grid: Restaurant Table (Left 2 cols) & Right Inspector (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-[#e3ece7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#151d1a]">
                  Danh sách Hồ sơ Thực địa
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#edf6f1] text-[#1B4D3E]">
                  Đợt thẩm định Q3
                </span>
              </div>
              <span className="text-[11px] text-[#707974]">
                Hiển thị {filteredList.length} trên 48 hồ sơ cần duyệt
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f8faf9] border-b border-[#e3ece7] text-[10px] uppercase font-bold text-[#707974] tracking-wider">
                    <th className="py-3 px-3 font-semibold">QUÁN ĂN & MÓN ĐẶC SẢN</th>
                    <th className="py-3 px-3 font-semibold">VỊ TRÍ</th>
                    <th className="py-3 px-3 font-semibold text-right">CHỨNG THỰC & TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf6f1]">
                  {filteredList.map((res) => {
                    const isSelected = selectedRes.id === res.id;
                    const isVerified = res.status === 'verified' || approvedIds.includes(res.id);
                    return (
                      <tr
                        key={res.id}
                        onClick={() => setSelectedRes(res)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf6f1]/80 border-l-4 border-l-[#1B4D3E]'
                            : 'hover:bg-[#f8faf9]'
                        }`}
                      >
                        {/* Cột 1: Tên quán + Chủ cơ sở + Món đặc sản */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={res.safetyLicenseImg}
                              alt={res.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#c9dbd0]/60"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-bold text-xs text-[#151d1a]">
                                  {res.name}
                                </h4>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800">
                                  {res.dishName}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#707974] mt-0.5">
                                Chủ: {res.ownerName} • MS: {res.code}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: VỊ TRÍ gộp Địa chỉ + Tọa độ GPS + Sai số RTK */}
                        <td className="py-2.5 px-3">
                          <p className="text-[11px] font-medium text-[#151d1a] truncate max-w-xs">
                            {res.address}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[#707974]">
                            <span>{res.coordsFormatted}</span>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 rounded text-[9px]">
                              {res.gpsAccuracy.split(' ')[1] || 'RTK'}
                            </span>
                          </div>
                        </td>

                        {/* Cột 3: Chứng thực & Trạng thái */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </span>
                            ) : res.status === 'need_inspect' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-[#404945]">
                                Chờ thực địa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                Pending Review
                              </span>
                            )}
                            <span className="text-[9px] text-[#707974] font-medium">
                              Đạt {res.auditPassed}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-[#edf6f1] flex items-center justify-between text-xs text-[#707974]">
            <span>Trang 1 / 12 • Tự động đồng bộ với máy chủ GIS</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
                Trước
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#1B4D3E] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
                3
              </button>
              <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Cửa Sổ Thẩm Định FR11 matching screenshot 3 */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D96B27]" />
                <h3 className="font-display font-bold text-sm text-[#151d1a]">
                  Cửa Sổ Thẩm Định FR11
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#76A286] bg-[#edf6f1] px-2 py-0.5 rounded-md">
                ID: #VER-2024-092
              </span>
            </div>

            {/* Restaurant header in panel */}
            <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e3ece7] space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#151d1a]">
                  {selectedRes.name}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  {approvedIds.includes(selectedRes.id) ? 'Đã duyệt' : 'Đang thẩm định'}
                </span>
              </div>
              <p className="text-[11px] text-[#707974]">{selectedRes.address}</p>
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <span className="text-[#404945]">GPS: {selectedRes.lat}, {selectedRes.lng}</span>
                <span className="text-emerald-700 font-bold">Bán kính AR: Khớp {selectedRes.arMatchingPercent}%</span>
              </div>
            </div>

            {/* Step 1: Đối chiếu vị trí vệ tinh & di tích gần nhất */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#151d1a]">
                <span>1. ĐỐI CHIẾU VỊ TRÍ VỆ TINH & DI TÍCH GẦN NHẤT</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  GeoFence Live
                </span>
              </div>

              {/* Map buffer visual */}
              <div className="p-3 rounded-xl bg-[#edf6f1] border border-[#c9dbd0]/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    <span className="font-semibold text-[#1B4D3E]">Văn Miếu - Quốc Tử Giám • 200m</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1B4D3E] text-white">
                    R: 350m AR Buffer
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e3ece7] text-[11px] text-[#404945] flex items-center justify-between">
                  <span>Bán kính Di tích: Hồ Gươm (650m), Nhà Hát Lớn (400m)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Step 2: Đối soát thư viện ẩm thực di sản */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#151d1a]">
                <span>2. ĐỐI SOÁT THƯ VIỆN ẨM THỰC DI SẢN</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Khớp 100% Danh mục</span>
              </div>

              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#151d1a]">
                      Bún chả Hà Nội (Nướng than hoa)
                    </p>
                    <p className="text-[10px] text-[#707974] font-mono">
                      Mã Di sản: DS-AMTHUC-014
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đạt chuẩn
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#151d1a]">
                      Nem cua bể Hải Phòng / Bắc Bộ
                    </p>
                    <p className="text-[10px] text-[#707974] font-mono">
                      Mã Di sản: DS-AMTHUC-089
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đạt chuẩn
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Hồ sơ ảnh minh chứng thực địa */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#151d1a] block">
                3. HỒ SƠ ẢNH MINH CHỨNG THỰC ĐỊA
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-[#c9dbd0]">
                  <img
                    src="/src/assets/images/bun_cha_1793939031267.jpg"
                    alt="Giấy phép ATTP"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-semibold">
                    GP ATTP số 482
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-[#c9dbd0]">
                  <img
                    src="/src/assets/images/ar_hanoi_view_1793939014182.jpg"
                    alt="Mặt tiền AR"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-semibold">
                    Mặt tiền AR
                  </span>
                </div>
              </div>
            </div>

            {/* Push Notice */}
            <div className="p-3 rounded-xl bg-[#edf6f1] border border-[#76A286]/40 flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-[#1B4D3E] shrink-0 animate-pulse" />
              <p className="text-[11px] text-[#1B4D3E] leading-tight">
                Dữ liệu duyệt sẽ cập nhật lên App Mobile người dùng trong 0.5s qua WebSocket.
              </p>
            </div>

            {/* Approval Main Button */}
            <button
              type="button"
              onClick={() => handleApprove(selectedRes)}
              className="w-full h-11 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#baeed9]" />
              <span>Ký Duyệt & Đẩy Lên App Mobile</span>
            </button>

            {/* Secondary actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                className="text-[#707974] hover:text-[#151d1a] hover:underline"
              >
                Yêu cầu bổ sung hồ sơ
              </button>
              <button
                type="button"
                className="text-[#1B4D3E] font-semibold hover:underline"
              >
                Xem lịch sử thẩm định →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
