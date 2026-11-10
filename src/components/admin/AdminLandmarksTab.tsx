import React, { useState, useEffect } from 'react';
import { ADMIN_LANDMARKS } from './adminMockData';
import { AdminLandmarkRecord } from './adminTypes';
import {
  Landmark,
  Compass,
  FileSpreadsheet,
  RefreshCw,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Camera,
  Volume2,
  Star,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  UtensilsCrossed,
  ShieldCheck,
  Radio,
  X,
  Check,
} from 'lucide-react';

interface AdminLandmarksTabProps {
  onOpenARPreview?: (landmark: AdminLandmarkRecord) => void;
  onNavigateTab?: (tab: any) => void;
}

export const AdminLandmarksTab: React.FC<AdminLandmarksTabProps> = ({
  onOpenARPreview,
  onNavigateTab,
}) => {
  const [landmarks, setLandmarks] = useState<AdminLandmarkRecord[]>(ADMIN_LANDMARKS);
  const [selectedLandmark, setSelectedLandmark] = useState<AdminLandmarkRecord>(ADMIN_LANDMARKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'badinh' | 'ar' | 'maint'>('all');
  const [checkedIds, setCheckedIds] = useState<string[]>([ADMIN_LANDMARKS[0].id]);
  const [isCalibrateModalOpen, setIsCalibrateModalOpen] = useState(false);
  const [dbRestaurants, setDbRestaurants] = useState<any[]>([]);

  // Add Landmark Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newLandmarkForm, setNewLandmarkForm] = useState({
    code: '',
    name: '',
    category: 'Lịch sử',
    badge: 'QG-ĐB' as 'QG-ĐB' | 'UNESCO' | 'DT-LS' | 'DT-KT',
    address: '',
    lat: '21.0359',
    lng: '105.8336',
    ar_heading: '120.0',
    rating: '4.9',
    has_3d_mesh: true,
    has_audio: true,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  });

  // Load Landmarks directly from Database
  const loadLandmarks = () => {
    fetch('/api/database/landmarks')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          const mapped: AdminLandmarkRecord[] = json.data.map((l: any) => {
            const coordsStr = l.location?.split('|')[1]?.trim() || '';
            const latVal = coordsStr ? parseFloat(coordsStr.split(',')[0]) : 21.0359;
            const lngVal = coordsStr ? parseFloat(coordsStr.split(',')[1]) : 105.8336;
            const dName = l.location?.includes('Ba Đình')
              ? 'Ba Đình'
              : l.location?.includes('Hoàn Kiếm')
              ? 'Hoàn Kiếm'
              : l.location?.includes('Đống Đa')
              ? 'Đống Đa'
              : l.location?.includes('Quận 1')
              ? 'Quận 1'
              : 'Trung tâm';

            return {
              id: l.id,
              code: l.code,
              name: l.name,
              subtitle: `${l.category} • Xếp hạng ${l.badge}`,
              district: dName,
              address: l.location?.split('|')[0]?.trim() || l.location,
              category: l.category === 'Lịch sử' ? 'historical' : l.category === 'Kiến trúc' ? 'architectural' : 'scenic',
              badge: l.badge,
              coordsFormatted: `${latVal.toFixed(4)}° N, ${lngVal.toFixed(4)}° E`,
              lat: latVal,
              lng: lngVal,
              bearing: `${l.ar_heading}°`,
              headingDegrees: l.ar_heading,
              pitchDegrees: 12.4,
              rating: l.rating,
              hasAR: Boolean(l.has_3d_mesh),
              hasAudio: Boolean(l.has_audio),
              geofenceRadius: 500,
              meshSizeMb: 14.2,
              meshLOD: 'LoD: Level 3',
              imageUrl: l.image_url,
              era: 'Bảo tồn cấp quốc gia',
              linkedFoodsCount: l.linked_foods_count || 8,
            };
          });
          setLandmarks(mapped);
          setSelectedLandmark((prev) => {
            const found = mapped.find((m) => m.id === prev?.id);
            return found || mapped[0];
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadLandmarks();

    fetch('/api/database/restaurants')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          setDbRestaurants(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateLandmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLandmarkForm.name.trim() || !newLandmarkForm.code.trim()) {
      alert('Vui lòng nhập đầy đủ tên di tích và mã ký hiệu!');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        code: newLandmarkForm.code.trim(),
        name: newLandmarkForm.name.trim(),
        category: newLandmarkForm.category,
        badge: newLandmarkForm.badge,
        location: `${newLandmarkForm.address.trim() || newLandmarkForm.name.trim()} | ${newLandmarkForm.lat}, ${newLandmarkForm.lng}`,
        ar_heading: parseFloat(newLandmarkForm.ar_heading) || 120.0,
        rating: parseFloat(newLandmarkForm.rating) || 4.9,
        has_3d_mesh: newLandmarkForm.has_3d_mesh,
        has_audio: newLandmarkForm.has_audio,
        image_url: newLandmarkForm.image_url.trim() || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        linked_foods_count: 8,
      };

      const res = await fetch('/api/database/landmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setToastMessage(`Đã thêm thành công di tích "${payload.name}" vào cơ sở dữ liệu!`);
        setTimeout(() => setToastMessage(null), 4000);
        loadLandmarks();
        setNewLandmarkForm({
          code: '',
          name: '',
          category: 'Lịch sử',
          badge: 'QG-ĐB',
          address: '',
          lat: '21.0359',
          lng: '105.8336',
          ar_heading: '120.0',
          rating: '4.9',
          has_3d_mesh: true,
          has_audio: true,
          image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu vào database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered landmarks
  const filteredList = landmarks.filter((lm) => {
    if (searchQuery && !lm.name.toLowerCase().includes(searchQuery.toLowerCase()) && !lm.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (quickFilter === 'badinh' && lm.district !== 'Ba Đình') {
      return false;
    }
    if (quickFilter === 'ar' && !lm.hasAR) {
      return false;
    }
    if (selectedDistrict !== 'all' && lm.district !== selectedDistrict) {
      return false;
    }
    if (selectedCategory !== 'all' && lm.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#76A286] tracking-wider uppercase font-mono">
              HỆ THỐNG CƠ SỞ DỮ LIỆU KHÔNG GIAN VĂN HÓA • TỌA ĐỘ WGS84 CHUẨN HÓA
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#151d1a]">
            Quản lý Hồ sơ Di tích & Điểm đến Văn hóa
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#edf6f1] border border-[#c9dbd0] text-[#1B4D3E] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#76A286]" />
            <span>Nhập dữ liệu Excel/GeoJSON</span>
          </button>

          <button
            type="button"
            className="h-10 px-3.5 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] border border-[#76A286]/50 text-[#1B4D3E] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            <span>Đồng bộ Tọa độ AR</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Di tích Mới</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Metric Cards - 100% Dynamic from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TỔNG DI TÍCH NẠP
            </span>
            <span className="font-display font-extrabold text-2xl text-[#151d1a] block mt-1">
              {landmarks.length}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              ✓ 100% định vị GPS
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              MÔ HÌNH 3D AR SẴN SÀNG
            </span>
            <span className="font-display font-extrabold text-2xl text-[#151d1a] block mt-1">
              {landmarks.filter((l) => l.hasAR).length}
            </span>
            <span className="text-[11px] text-orange-700 font-medium">
              {landmarks.filter((l) => !l.hasAR).length} điểm đang quét LiDAR
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D96B27] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              AUDIO THUYẾT MINH ĐA NGỮ
            </span>
            <span className="font-display font-extrabold text-2xl text-[#151d1a] block mt-1">
              {landmarks.filter((l) => l.hasAudio).length}
            </span>
            <span className="text-[11px] text-[#707974] font-medium">
              🌐 VN / EN / FR / JP
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              LIÊN KẾT ẨM THỰC VÙNG
            </span>
            <span className="font-display font-extrabold text-2xl text-[#151d1a] block mt-1">
              {landmarks.reduce((acc, curr) => acc + (curr.linkedFoodsCount || 0), 0)}
            </span>
            <span className="text-[11px] text-[#707974] font-medium">
              🍴 Bán kính 800m trung bình
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-[#707974] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên di tích, mã ký hiệu hoặc đức..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] placeholder-[#707974] focus:outline-hidden focus:border-[#1B4D3E]"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
            >
              <option value="all">Tất cả Loại hình</option>
              <option value="historical">Di tích Lịch sử</option>
              <option value="architectural">Kiến trúc Nghệ thuật</option>
              <option value="scenic">Danh lam Thắng cảnh</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
            >
              <option value="all">Tất cả Quận / Huyện</option>
              <option value="Ba Đình">Ba Đình</option>
              <option value="Hoàn Kiếm">Hoàn Kiếm</option>
              <option value="Đống Đa">Đống Đa</option>
              <option value="Tây Hồ">Tây Hồ</option>
              <option value="Quận 1">Quận 1 (TP.HCM)</option>
            </select>
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-[#707974]">Bộ lọc nhanh:</span>
            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === 'badinh' ? 'all' : 'badinh')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                quickFilter === 'badinh'
                  ? 'bg-[#1B4D3E] text-white'
                  : 'bg-[#f3fbf6] border border-[#c9dbd0] text-[#404945]'
              }`}
            >
              <span>Quận Ba Đình</span>
              {quickFilter === 'badinh' && <span>✕</span>}
            </button>

            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === 'ar' ? 'all' : 'ar')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                quickFilter === 'ar'
                  ? 'bg-[#1B4D3E] text-white'
                  : 'bg-[#f3fbf6] border border-[#c9dbd0] text-[#404945]'
              }`}
            >
              Có AR Viewport ({landmarks.filter((l) => l.hasAR).length})
            </button>

            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === 'maint' ? 'all' : 'maint')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                quickFilter === 'maint'
                  ? 'bg-[#1B4D3E] text-white'
                  : 'bg-[#f3fbf6] border border-[#c9dbd0] text-[#404945]'
              }`}
            >
              Cần quét 3D ({landmarks.filter((l) => !l.hasAR).length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#707974]">
            <span>Hiển thị {filteredList.length} / {landmarks.length} kết quả</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('all');
                setSelectedCategory('all');
                setQuickFilter('all');
              }}
              className="p-1 hover:text-[#151d1a]"
              title="Đặt lại bộ lọc"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Landmarks Table (Left 2 cols) & Right Inspector (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-[#e3ece7] text-[10px] uppercase font-bold text-[#707974] tracking-wider">
                  <th className="py-3 px-3 w-8">
                    <CheckSquare className="w-3.5 h-3.5 text-[#1B4D3E]" />
                  </th>
                  <th className="py-3 px-2 font-semibold">DI TÍCH & ĐÁNH GIÁ</th>
                  <th className="py-3 px-3 font-semibold">VỊ TRÍ</th>
                  <th className="py-3 px-3 font-semibold text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6f1]">
                {filteredList.map((item) => {
                  const isSelected = selectedLandmark.id === item.id;
                  const isChecked = checkedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLandmark(item)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#edf6f1]/80 border-l-4 border-l-[#1B4D3E]'
                          : 'hover:bg-[#f8faf9]'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={(e) => toggleCheck(item.id, e)}
                          className="text-[#1B4D3E]"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#1B4D3E]" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-[#707974]" />
                          )}
                        </button>
                      </td>

                      {/* Gộp Di tích + Badge + Rating + AR/Audio vào 1 cột */}
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#c9dbd0]/60"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-xs text-[#151d1a]">
                                {item.name}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#edf6f1] text-[#1B4D3E]">
                                {item.badge}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                                ★ {item.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#707974] mt-0.5 font-mono">
                              <span>ID: {item.code}</span>
                              <span>•</span>
                              <span className="text-[#1B4D3E] font-semibold">{item.hasAR ? 'AR 3D' : ''} {item.hasAudio ? '• Audio' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 1 Cột VỊ TRÍ duy nhất gộp: Địa chỉ + Tọa độ WGS84 + Phương vị */}
                      <td className="py-2.5 px-3">
                        <p className="text-[11px] font-medium text-[#151d1a] truncate max-w-xs">
                          {item.address}
                        </p>
                        <p className="font-mono text-[10px] text-[#707974] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#1B4D3E] shrink-0" />
                          <span>{item.coordsFormatted}</span>
                          <span className="text-[#1B4D3E] font-semibold">({item.bearing.split(' ')[0]})</span>
                        </p>
                      </td>

                      {/* Thao tác */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-[#edf6f1] hover:bg-[#dce6e0] text-[#1B4D3E] font-semibold text-[11px] transition-colors"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#edf6f1] flex items-center justify-between text-xs text-[#707974]">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select className="h-7 px-2 rounded-lg bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a]">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <span>hàng mỗi trang</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
                <ChevronLeft className="w-3.5 h-3.5" />
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
              <span>...</span>
              <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
                15
              </button>
              <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Inspector Panel matching screenshot 2 */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#76A286] uppercase block">
                  HỒ SƠ DI TÍCH CHỌN
                </span>
                <h3 className="font-display font-bold text-sm text-[#151d1a]">
                  Active Focal Point
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Selected Landmark Image & Header */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gray-900 shadow-xs">
              <img
                src={selectedLandmark.imageUrl}
                alt={selectedLandmark.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-base">
                    {selectedLandmark.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-1">
                    ★ {selectedLandmark.rating}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 truncate">
                  {selectedLandmark.subtitle}
                </p>
              </div>
            </div>

            {/* AR & Geofencing Parameters Box */}
            <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#151d1a] uppercase tracking-wide">
                  THÔNG SỐ CAMERA AR & GEOFENCING
                </span>
                <Radio className="w-3.5 h-3.5 text-[#1B4D3E]" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white border border-[#e3ece7]">
                  <span className="text-[10px] text-[#707974] block">Tọa độ Neo (Anchor)</span>
                  <span className="font-mono font-bold text-[11px] text-[#151d1a] truncate block">
                    {selectedLandmark.coordsFormatted}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e3ece7]">
                  <span className="text-[10px] text-[#707974] block">Bán kính kích hoạt AR</span>
                  <span className="font-bold text-[11px] text-[#151d1a] block">
                    {selectedLandmark.geofenceRadius}m ({selectedLandmark.meshLOD})
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e3ece7]">
                  <span className="text-[10px] text-[#707974] block">Góc ngẩng Pitch / Yaw</span>
                  <span className="font-bold text-[11px] text-[#151d1a] block">
                    +{selectedLandmark.pitchDegrees}° / {selectedLandmark.headingDegrees}°
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e3ece7]">
                  <span className="text-[10px] text-[#707974] block">Tải trọng Mesh 3D</span>
                  <span className="font-bold text-[11px] text-[#151d1a] block">
                    {selectedLandmark.meshSizeMb} MB (GLB/USDZ)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenARPreview?.(selectedLandmark)}
                  className="h-9 px-3 rounded-xl bg-white hover:bg-[#edf6f1] border border-[#c9dbd0] text-[#1B4D3E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera HUD Viewport</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalibrateModalOpen(true)}
                  className="h-9 px-3 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] border border-[#76A286]/50 text-[#1B4D3E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Chỉnh Calibrate</span>
                </button>
              </div>
            </div>

            {/* Món & Quán ăn lân cận (8) • Bán kính <= 800m */}
            <div className="space-y-2.5 pt-2 border-t border-[#edf6f1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#D96B27]" />
                  <h4 className="font-bold text-xs text-[#151d1a]">
                    Món & Quán ăn lân cận ({selectedLandmark.linkedFoodsCount})
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-[#707974]">
                  Bán kính ≤ 800m
                </span>
              </div>

              <p className="text-[11px] text-[#707974] leading-relaxed">
                Khách du lịch sau khi quét AR tại {selectedLandmark.name} sẽ được gợi ý các trải nghiệm ẩm thực liên kết di sản xung quanh:
              </p>

              {/* Mini restaurant recommendation list */}
              <div className="space-y-2">
                {(dbRestaurants.length > 0 ? dbRestaurants.slice(0, 4) : [
                  { id: '1', name: 'Phở Bát Đàn', specialty_dish: 'Phở bò tái lăn', location: '49 Bát Đàn', verification_status: 'Verified' },
                  { id: '2', name: 'Bún Chả Hương Liên', specialty_dish: 'Bún chả nướng than hoa', location: '24 Lê Văn Hưu', verification_status: 'Pending' },
                  { id: '3', name: 'Chả Cá Thăng Long', specialty_dish: 'Chả cá lăng gia truyền', location: '19 Đường Thành', verification_status: 'Verified' },
                  { id: '4', name: 'Bánh Cuốn Bà Hoành', specialty_dish: 'Bánh cuốn mộc nhĩ', location: '66 Tô Hiến Thành', verification_status: 'Verified' },
                ]).map((res: any, idx: number) => (
                  <div key={res.id || idx} className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e3ece7] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#edf6f1] flex items-center justify-center text-[#1B4D3E] font-bold text-xs shrink-0 border border-[#c9dbd0]">
                        <UtensilsCrossed className="w-4 h-4 text-[#D96B27]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#151d1a] truncate">
                          {res.name}
                        </p>
                        <p className="text-[10px] text-[#707974] truncate">
                          {res.specialty_dish} • {res.location?.split('|')[0]?.trim()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      res.verification_status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {res.verification_status === 'Verified' ? 'Đã cấp tích' : 'Đề xuất'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab?.('culinary')}
                className="w-full h-10 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Quản Lý Liên Kết Món & Điểm Ăn</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Map: Bản đồ Định vị AR Thực địa & Độc quyền Di sản */}
      <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1B4D3E]" />
            <h3 className="font-display font-bold text-base text-[#151d1a]">
              Bản đồ Định vị AR Thực địa & Độc quyền Di sản
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#404945] font-medium">Trạm định vị Ba Đình • RTK Active</span>
          </div>
        </div>

        {/* Map Preview Banner matching design */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/8] bg-emerald-950 border border-[#c9dbd0]">
          {/* Real styled map visual */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-75"
            style={{
              backgroundImage: `url('/src/assets/images/ar_hanoi_view_1793939014182.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-[#003629]/60 mix-blend-multiply" />

          {/* Interactive AR Markers overlaid on Map */}
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#1B4D3E] text-[#baeed9] text-[10px] font-mono font-bold shadow-md">
              Chùa Một Cột (Anchor)
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/40 animate-ping mt-1" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#D96B27] text-white text-[10px] font-mono font-bold shadow-md">
              Hoàng Thành Thăng Long
            </div>
            <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/40 mt-1" />
          </div>

          {/* Overlay info box */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-white">
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#baeed9]" />
              <p className="text-xs">
                <span className="font-bold">Khu bảo tồn Cụm Di tích Ba Đình - Tây Hồ</span> • Bán kính quét AR hiệu dụng: 1,200m • Tần số làm tươi: 60Hz
              </p>
            </div>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Mở Map Fullscreen
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm Di Tích Mới Vào Cơ Sở Dữ Liệu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#c9dbd0] shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#1B4D3E] to-[#003629] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Landmark className="w-5 h-5 text-[#baeed9]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Thêm Hồ Sơ Di Tích & Địa Danh Mới</h3>
                  <p className="text-xs text-white/80">Lưu trực tiếp vào bảng heritage_landmarks chuẩn hóa WGS84</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateLandmark} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Mã Di Tích (Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: DT-HN-00125"
                    value={newLandmarkForm.code}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, code: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-mono focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Tên Di Tích <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đền Quán Thánh"
                    value={newLandmarkForm.name}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-bold focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Phân Loại
                  </label>
                  <select
                    value={newLandmarkForm.category}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  >
                    <option value="Lịch sử">Di tích Lịch sử</option>
                    <option value="Kiến trúc">Kiến trúc Nghệ thuật</option>
                    <option value="Danh thắng">Danh lam Thắng cảnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Xếp Hạng Bảo Tồn
                  </label>
                  <select
                    value={newLandmarkForm.badge}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, badge: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  >
                    <option value="QG-ĐB">QG-ĐB (Quốc gia Đặc biệt)</option>
                    <option value="UNESCO">UNESCO (Di sản Thế giới)</option>
                    <option value="DT-LS">DT-LS (Di tích Lịch sử)</option>
                    <option value="DT-KT">DT-KT (Di tích Kiến trúc)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151d1a] mb-1">
                  Địa Chỉ Cụ Thể
                </label>
                <input
                  type="text"
                  placeholder="VD: Đường Thanh Niên, Quán Thánh, Ba Đình, Hà Nội"
                  value={newLandmarkForm.address}
                  onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, address: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                />
              </div>

              {/* Tọa độ chuẩn WGS84 & La bàn AR */}
              <div className="p-3.5 bg-[#edf6f1]/60 rounded-2xl border border-[#c9dbd0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4D3E]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>TỌA ĐỘ VỊ TRÍ WGS84 & THÔNG SỐ AR</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#404945] mb-1">
                      Vĩ độ (Latitude)
                    </label>
                    <input
                      type="text"
                      placeholder="21.0359"
                      value={newLandmarkForm.lat}
                      onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, lat: e.target.value })}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#c9dbd0] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#404945] mb-1">
                      Kinh độ (Longitude)
                    </label>
                    <input
                      type="text"
                      placeholder="105.8336"
                      value={newLandmarkForm.lng}
                      onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, lng: e.target.value })}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#c9dbd0] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#404945] mb-1">
                      Góc La Bàn AR Heading (°)
                    </label>
                    <input
                      type="number"
                      placeholder="120.0"
                      value={newLandmarkForm.ar_heading}
                      onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, ar_heading: e.target.value })}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#c9dbd0] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Đánh Giá Ban Đầu (★ 1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newLandmarkForm.rating}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, rating: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Link Ảnh Đại Diện (URL)
                  </label>
                  <input
                    type="url"
                    value={newLandmarkForm.image_url}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, image_url: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>
              </div>

              {/* Tùy chọn AR & Audio */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#151d1a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLandmarkForm.has_3d_mesh}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, has_3d_mesh: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1B4D3E] accent-[#1B4D3E]"
                  />
                  <span>Tích hợp Mô hình 3D AR (Mesh LoD 3)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#151d1a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLandmarkForm.has_audio}
                    onChange={(e) => setNewLandmarkForm({ ...newLandmarkForm, has_audio: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1B4D3E] accent-[#1B4D3E]"
                  />
                  <span>Audio Thuyết Minh Đa Ngữ AI</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#edf6f1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c9dbd0] hover:bg-[#f8faf9] text-xs font-semibold text-[#404945] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang lưu vào DB...</span>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Lưu Hồ Sơ Vào Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
