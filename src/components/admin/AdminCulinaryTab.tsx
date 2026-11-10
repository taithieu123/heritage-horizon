import React, { useState, useEffect } from 'react';
import { ADMIN_CULINARY } from './adminMockData';
import { AdminCulinaryRecord } from './adminTypes';
import {
  UtensilsCrossed,
  ShieldAlert,
  Store,
  Camera,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Database,
} from 'lucide-react';

export const AdminCulinaryTab: React.FC = () => {
  const [culinaryList, setCulinaryList] = useState<AdminCulinaryRecord[]>(ADMIN_CULINARY);
  const [activeTab, setActiveTab] = useState<'dishes' | 'allergens'>('dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedWarningLevel, setSelectedWarningLevel] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Sync with Database API
  useEffect(() => {
    fetch('/api/database/culinary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          const mapped: AdminCulinaryRecord[] = json.data.map((c: any) => {
            const rawAllergens = c.allergens_fr08 || '';
            const tags = rawAllergens.split(',').map((t: string) => {
              const label = t.trim();
              let type: 'danger' | 'warning' | 'safe' | 'info' = 'info';
              if (label.toLowerCase().includes('mắm tôm') || label.toLowerCase().includes('lạc') || label.toLowerCase().includes('ốc')) {
                type = 'danger';
              } else if (label.toLowerCase().includes('gluten')) {
                type = 'safe';
              } else if (label.toLowerCase().includes('mắm') || label.toLowerCase().includes('quế') || label.toLowerCase().includes('hồi')) {
                type = 'warning';
              }
              return { label, type };
            });

            return {
              id: c.id,
              code: c.code,
              name: c.name,
              subtitle: `Đặc sản vùng ${c.origin_region}`,
              originRegion: c.origin_region,
              historicalEra: 'Di sản truyền thống',
              coreIngredients: 'Nguyên liệu tuyển chọn gia truyền',
              allergens: tags,
              servingRestaurantsCount: c.total_restaurants || 1,
              priceRange: c.price_range || '50.000 - 80.000 đ',
              status: 'serving' as const,
              imageUrl: c.image_url || '/src/assets/images/bun_cha_1793939031267.jpg',
            };
          });
          setCulinaryList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredDishes = culinaryList.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.originRegion.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-[#76A286] tracking-wider uppercase font-mono">
              TIÊU CHUẨN ĐỊNH DANH DỊ ỨNG QUỐC TẾ FR08 • ENGINE AI VISION V3.1
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#151d1a]">
            Quản lý Danh mục Ẩm thực & Thư viện Thành phần Dị ứng
          </h1>
          <p className="text-xs text-[#707974] mt-0.5 max-w-3xl">
            Chuẩn hoá dữ liệu ẩm thực di sản, liên kết trực tiếp với nhãn an toàn FR08 phục vụ cơ chế quét thời gian thực qua AR Camera và định vị ẩm thực vỉa hè.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            className="h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>+ Thêm Nhãn Dị ứng FR08</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Món Ăn Mới</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TỔNG MÓN DI SẢN
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-2xl text-[#151d1a]">485</span>
              <span className="text-[11px] text-emerald-700 font-bold">+18 mới</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              NHÃN CẢNH BÁO FR08
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-2xl text-[#D96B27]">120</span>
              <span className="text-[11px] text-rose-700 font-bold">14 cấp độ cao</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D96B27] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              QUÁN ĐỐI TÁC KÍCH HOẠT
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-2xl text-emerald-700">1,842</span>
              <span className="text-[11px] text-[#707974]">98% xác minh</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TỶ LỆ QUÉT AR THỰC ĐƠN
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-2xl text-[#151d1a]">99.4%</span>
              <span className="text-[11px] text-emerald-700 font-bold">Độ tin cậy</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mode Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-[#c9dbd0] pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dishes'
              ? 'bg-[#1B4D3E] text-white shadow-2xs'
              : 'text-[#404945] hover:bg-[#edf6f1]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Danh mục Món ăn di sản (485)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('allergens')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'allergens'
              ? 'bg-[#1B4D3E] text-white shadow-2xs'
              : 'text-[#404945] hover:bg-[#edf6f1]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#D96B27]" />
          <span>Từ điển Thành phần & Cảnh báo Dị ứng (120)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#707974] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên món (Bún Chả, Phở...), gia..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] placeholder-[#707974] focus:outline-hidden focus:border-[#1B4D3E]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
          >
            <option value="all">Phong cách: Tất cả phong cách</option>
            <option value="nuoc">Món nước</option>
            <option value="kho">Món khô / xào</option>
            <option value="cuon">Món cuốn / nướng</option>
          </select>

          <select
            value={selectedWarningLevel}
            onChange={(e) => setSelectedWarningLevel(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
          >
            <option value="all">Cảnh báo: Tất cả mức độ</option>
            <option value="high">Mức độ cao (Mắm tôm, Đậu phộng)</option>
            <option value="safe">An toàn Gluten (GF)</option>
          </select>

          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-[#f3fbf6] hover:bg-[#edf6f1] border border-[#c9dbd0] flex items-center justify-center text-[#404945]"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table matching screenshot 4 */}
      <div className="bg-white rounded-2xl border border-[#c9dbd0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8faf9] border-b border-[#e3ece7] text-[10px] uppercase font-bold text-[#707974] tracking-wider">
                <th className="py-3 px-3 font-semibold">MÓN ĂN & NGUỒN GỐC DI SẢN</th>
                <th className="py-3 px-3 font-semibold">CẢNH BÁO DỊ ỨNG (FR08)</th>
                <th className="py-3 px-3 font-semibold text-right">QUÁN, GIÁ & TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf6f1]">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-[#f8faf9] transition-colors">
                  {/* Cột 1: Món ăn + Hình ảnh + Nguồn gốc xuất xứ */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#c9dbd0]/60 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-xs text-[#151d1a]">
                            {dish.name}
                          </h4>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#edf6f1] text-[#1B4D3E]">
                            {dish.originRegion}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#707974] mt-0.5 truncate max-w-xs">
                          {dish.subtitle} • {dish.historicalEra}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Cảnh báo dị ứng FR08 */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {dish.allergens.map((alg, idx) => {
                        if (alg.type === 'danger') {
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-50 text-rose-800 border border-rose-200"
                            >
                              • {alg.label}
                            </span>
                          );
                        }
                        if (alg.type === 'warning') {
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-orange-50 text-orange-900 border border-orange-200"
                            >
                              • {alg.label}
                            </span>
                          );
                        }
                        if (alg.type === 'safe') {
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                            >
                              ✓ {alg.label}
                            </span>
                          );
                        }
                        return (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded-full text-[9px] font-medium bg-gray-100 text-[#404945]"
                          >
                            • {alg.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Cột 3: Quán phục vụ, Giá & Trạng thái */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#151d1a]">
                          {dish.priceRange}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">
                          {dish.servingRestaurantsCount} quán
                        </span>
                      </div>
                      <span className="text-[10px] text-[#707974]">
                        Đang phục vụ
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#edf6f1] flex items-center justify-between text-xs text-[#707974]">
          <span>Hiển thị 1 - 5 trong tổng số 485 món ăn di sản</span>
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
            <span>...</span>
            <button className="w-7 h-7 rounded-lg border border-[#c9dbd0] flex items-center justify-center hover:bg-[#f3fbf6]">
              97
            </button>
            <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
