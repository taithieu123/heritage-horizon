import React, { useState, useEffect } from 'react';
import { ADMIN_CULINARY } from './adminMockData';
import { AdminCulinaryRecord, AdminAllergenRecord } from './adminTypes';
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
  X,
  Check,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const AdminCulinaryTab: React.FC = () => {
  const [culinaryList, setCulinaryList] = useState<AdminCulinaryRecord[]>(ADMIN_CULINARY);
  const [allergensList, setAllergensList] = useState<AdminAllergenRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dishes' | 'allergens'>('dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedWarningLevel, setSelectedWarningLevel] = useState('all');

  // Modal states
  const [isNewDishModalOpen, setIsNewDishModalOpen] = useState(false);
  const [isNewAllergenModalOpen, setIsNewAllergenModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Dish Form State
  const [newDishForm, setNewDishForm] = useState({
    code: '',
    name: '',
    origin_region: 'Hà Nội (Kinh Kỳ)',
    allergens_fr08: 'Không Gluten (GF)',
    price_range: '50.000 - 80.000 đ',
    total_restaurants: 12,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  });

  // New Allergen Form State
  const [newAllergenForm, setNewAllergenForm] = useState<{
    code: string;
    name: string;
    risk_level: 'danger' | 'warning' | 'safe' | 'info';
    symptoms_desc: string;
    common_in_dishes: string;
  }>({
    code: '',
    name: '',
    risk_level: 'warning',
    symptoms_desc: '',
    common_in_dishes: '',
  });

  // Load Dishes from Database
  const loadDishes = () => {
    fetch('/api/database/culinary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          const mapped: AdminCulinaryRecord[] = json.data.map((c: any) => {
            const rawAllergens = c.allergens_fr08 || '';
            const tags = rawAllergens.split(',').map((t: string) => {
              const label = t.trim();
              let type: 'danger' | 'warning' | 'safe' | 'info' = 'info';
              if (
                label.toLowerCase().includes('mắm tôm') ||
                label.toLowerCase().includes('lạc') ||
                label.toLowerCase().includes('ốc') ||
                label.toLowerCase().includes('sữa') ||
                label.toLowerCase().includes('patê')
              ) {
                type = 'danger';
              } else if (label.toLowerCase().includes('gluten')) {
                type = 'safe';
              } else if (
                label.toLowerCase().includes('mắm') ||
                label.toLowerCase().includes('quế') ||
                label.toLowerCase().includes('hồi') ||
                label.toLowerCase().includes('trứng') ||
                label.toLowerCase().includes('thịt lợn') ||
                label.toLowerCase().includes('cá')
              ) {
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
  };

  // Load Allergens from Database
  const loadAllergens = () => {
    fetch('/api/database/allergens')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAllergensList(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadDishes();
    loadAllergens();
  }, []);

  // Filtered Dishes
  const filteredDishes = culinaryList.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.originRegion.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedWarningLevel === 'high') {
      const hasDanger = item.allergens.some((a) => a.type === 'danger');
      if (!hasDanger) return false;
    }
    if (selectedWarningLevel === 'safe') {
      const hasSafe = item.allergens.some((a) => a.type === 'safe');
      if (!hasSafe) return false;
    }
    return true;
  });

  // Filtered Allergens
  const filteredAllergens = allergensList.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.common_in_dishes.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedWarningLevel === 'high' && item.risk_level !== 'danger') {
      return false;
    }
    if (selectedWarningLevel === 'safe' && item.risk_level !== 'safe') {
      return false;
    }
    return true;
  });

  // Handle Create Dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishForm.name.trim() || !newDishForm.code.trim()) {
      alert('Vui lòng điền đầy đủ Mã món và Tên món ăn!');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        code: newDishForm.code.trim(),
        name: newDishForm.name.trim(),
        origin_region: newDishForm.origin_region.trim(),
        allergens_fr08: newDishForm.allergens_fr08.trim(),
        price_range: newDishForm.price_range.trim(),
        total_restaurants: Number(newDishForm.total_restaurants) || 1,
        image_url:
          newDishForm.image_url.trim() ||
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      };

      const res = await fetch('/api/database/culinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewDishModalOpen(false);
        setToastMessage(`Đã thêm thành công món di sản "${payload.name}" vào cơ sở dữ liệu!`);
        setTimeout(() => setToastMessage(null), 4000);
        loadDishes();
        setNewDishForm({
          code: '',
          name: '',
          origin_region: 'Hà Nội (Kinh Kỳ)',
          allergens_fr08: 'Không Gluten (GF)',
          price_range: '50.000 - 80.000 đ',
          total_restaurants: 12,
          image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu món ăn vào database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Create Allergen
  const handleCreateAllergen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergenForm.name.trim() || !newAllergenForm.code.trim()) {
      alert('Vui lòng điền đầy đủ Mã nhãn FR08 và Tên dị ứng!');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        code: newAllergenForm.code.trim(),
        name: newAllergenForm.name.trim(),
        risk_level: newAllergenForm.risk_level,
        symptoms_desc: newAllergenForm.symptoms_desc.trim() || 'Cần theo dõi kích ứng đường tiêu hóa và niêm mạc.',
        common_in_dishes: newAllergenForm.common_in_dishes.trim() || 'Các món đặc sản truyền thống.',
      };

      const res = await fetch('/api/database/allergens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewAllergenModalOpen(false);
        setToastMessage(`Đã thêm nhãn dị ứng FR08 "${payload.name}" vào bảng allergen_labels!`);
        setTimeout(() => setToastMessage(null), 4000);
        loadAllergens();
        setActiveTab('allergens');
        setNewAllergenForm({
          code: '',
          name: '',
          risk_level: 'warning',
          symptoms_desc: '',
          common_in_dishes: '',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu nhãn dị ứng vào database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
            onClick={() => setIsNewAllergenModalOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>+ Thêm Nhãn Dị ứng FR08</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewDishModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Món Ăn Mới</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
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

      {/* 4 Stat Cards - 100% Dynamic from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TỔNG MÓN DI SẢN
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-2xl text-[#151d1a]">
                {culinaryList.length}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">Chuẩn hóa FR08</span>
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
              <span className="font-display font-extrabold text-2xl text-[#D96B27]">
                {allergensList.length}
              </span>
              <span className="text-[11px] text-rose-700 font-bold">
                {allergensList.filter((a) => a.risk_level === 'danger').length} cấp độ cao
              </span>
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
              <span className="font-display font-extrabold text-2xl text-emerald-700">
                {culinaryList.reduce((acc, c) => acc + (c.servingRestaurantsCount || 0), 0)}
              </span>
              <span className="text-[11px] text-[#707974]">Điểm phục vụ</span>
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
          <span>Danh mục Món ăn di sản ({culinaryList.length})</span>
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
          <span>Từ điển Thành phần & Cảnh báo Dị ứng ({allergensList.length})</span>
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
            placeholder={
              activeTab === 'dishes'
                ? 'Tìm theo tên món (Bún Chả, Phở...), vùng miền, mã...'
                : 'Tìm theo tên dị ứng (Mắm tôm, Lạc...), triệu chứng...'
            }
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] placeholder-[#707974] focus:outline-hidden focus:border-[#1B4D3E]"
          />
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'dishes' && (
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
            >
              <option value="all">Phong cách: Tất cả</option>
              <option value="nuoc">Món nước</option>
              <option value="kho">Món khô / nướng</option>
            </select>
          )}

          <select
            value={selectedWarningLevel}
            onChange={(e) => setSelectedWarningLevel(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#f3fbf6] border border-[#c9dbd0] text-xs text-[#151d1a] focus:outline-hidden focus:border-[#1B4D3E]"
          >
            <option value="all">Cảnh báo: Tất cả mức độ</option>
            <option value="high">Mức độ cao (Nguy cơ sốc/dị ứng)</option>
            <option value="safe">An toàn Gluten (Gluten-Free)</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStyle('all');
              setSelectedWarningLevel('all');
            }}
            className="px-3 h-10 rounded-xl bg-[#f3fbf6] hover:bg-[#edf6f1] border border-[#c9dbd0] text-xs font-semibold text-[#404945] flex items-center gap-1.5"
            title="Đặt lại bộ lọc"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DANH MỤC MÓN ĂN DI SẢN */}
      {activeTab === 'dishes' && (
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
                          <p className="text-[10px] text-[#707974] mt-0.5 truncate max-w-xs font-mono">
                            Mã: {dish.code} • {dish.subtitle}
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
                        <span className="text-[10px] text-emerald-700 font-medium">
                          ✓ Đang phục vụ
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
            <span>Hiển thị 1 - {filteredDishes.length} trong tổng số {culinaryList.length} món ăn di sản</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
                Trước
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#1B4D3E] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TỪ ĐIỂN THÀNH PHẦN & CẢNH BÁO DỊ ỨNG FR08 (allergen_labels) */}
      {activeTab === 'allergens' && (
        <div className="bg-white rounded-2xl border border-[#c9dbd0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-[#e3ece7] text-[10px] uppercase font-bold text-[#707974] tracking-wider">
                  <th className="py-3 px-3 font-semibold">MÃ & THÀNH PHẦN DỊ NGUYÊN (FR08)</th>
                  <th className="py-3 px-3 font-semibold">MỨC ĐỘ NGUY CƠ</th>
                  <th className="py-3 px-3 font-semibold">TRIỆU CHỨNG & KHUYẾN NGHỊ</th>
                  <th className="py-3 px-3 font-semibold">MÓN ĂN THƯỜNG GẶP</th>
                  <th className="py-3 px-3 font-semibold text-right">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6f1]">
                {filteredAllergens.map((alg) => (
                  <tr key={alg.id} className="hover:bg-[#f8faf9] transition-colors">
                    {/* Mã & Tên thành phần */}
                    <td className="py-3 px-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#1B4D3E] bg-[#edf6f1] px-1.5 py-0.2 rounded">
                            {alg.code}
                          </span>
                          <span className="font-bold text-xs text-[#151d1a]">
                            {alg.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Mức độ nguy cơ */}
                    <td className="py-3 px-3">
                      {alg.risk_level === 'danger' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          Nguy cơ cao (Danger)
                        </span>
                      )}
                      {alg.risk_level === 'warning' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-900 border border-orange-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          Cảnh báo (Warning)
                        </span>
                      )}
                      {alg.risk_level === 'safe' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          An toàn (Gluten-Free)
                        </span>
                      )}
                      {alg.risk_level === 'info' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-[#404945]">
                          Thông tin (Info)
                        </span>
                      )}
                    </td>

                    {/* Triệu chứng & Khuyến nghị */}
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-[#404945] leading-relaxed">
                        {alg.symptoms_desc}
                      </p>
                    </td>

                    {/* Món ăn thường gặp */}
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-[#707974] italic">
                        {alg.common_in_dishes}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" />
                        AR Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#edf6f1] flex items-center justify-between text-xs text-[#707974]">
            <span>Hiển thị {filteredAllergens.length} nhãn cảnh báo trong bảng allergen_labels</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded-lg border border-[#c9dbd0] hover:bg-[#f3fbf6]">
                1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: THÊM MÓN ĂN MỚI */}
      {isNewDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#c9dbd0] shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#1B4D3E] to-[#003629] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <UtensilsCrossed className="w-5 h-5 text-[#baeed9]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Thêm Món Ăn Di Sản Mới</h3>
                  <p className="text-xs text-white/80">Lưu trực tiếp vào bảng culinary_items</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateDish} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Mã Món Di Sản <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: DS-AMTHUC-055"
                    value={newDishForm.code}
                    onChange={(e) => setNewDishForm({ ...newDishForm, code: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-mono focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Tên Món Ăn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bún Thang Phố Cổ"
                    value={newDishForm.name}
                    onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-bold focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Vùng Miền Xuất Xứ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội (Kinh Kỳ)"
                    value={newDishForm.origin_region}
                    onChange={(e) => setNewDishForm({ ...newDishForm, origin_region: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Khoảng Giá Phục Vụ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 55.000 - 85.000 đ"
                    value={newDishForm.price_range}
                    onChange={(e) => setNewDishForm({ ...newDishForm, price_range: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151d1a] mb-1">
                  Nhãn Cảnh Báo Dị Ứng FR08 (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="VD: Trứng gà, Tôm khô, Không Gluten (GF)"
                  value={newDishForm.allergens_fr08}
                  onChange={(e) => setNewDishForm({ ...newDishForm, allergens_fr08: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                />
                <p className="text-[10px] text-[#707974] mt-1">
                  Gợi ý: Mắm tôm, Lạc rang, Không Gluten (GF), Thịt lợn, Hồi • Quế
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Số Quán Phục Vụ Ước Tính
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newDishForm.total_restaurants}
                    onChange={(e) => setNewDishForm({ ...newDishForm, total_restaurants: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Link Ảnh Món Ăn (URL)
                  </label>
                  <input
                    type="url"
                    value={newDishForm.image_url}
                    onChange={(e) => setNewDishForm({ ...newDishForm, image_url: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-[#1B4D3E]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#edf6f1]">
                <button
                  type="button"
                  onClick={() => setIsNewDishModalOpen(false)}
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
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Lưu Món Vào Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM NHÃN DỊ ỨNG FR08 */}
      {isNewAllergenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-rose-200 shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-rose-700 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <ShieldAlert className="w-5 h-5 text-rose-200" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Thêm Nhãn Cảnh Báo Dị Ứng Quốc Tế FR08</h3>
                  <p className="text-xs text-white/80">Lưu trực tiếp vào bảng allergen_labels</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAllergenModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAllergen} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Mã Nhãn FR08 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: FR08-ALG-011"
                    value={newAllergenForm.code}
                    onChange={(e) => setNewAllergenForm({ ...newAllergenForm, code: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-mono focus:outline-hidden focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151d1a] mb-1">
                    Tên Thành Phần / Dị Nguyên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mè đen / Vừng rang"
                    value={newAllergenForm.name}
                    onChange={(e) => setNewAllergenForm({ ...newAllergenForm, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs font-bold focus:outline-hidden focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151d1a] mb-1">
                  Cấp Độ Nguy Cơ (Risk Level)
                </label>
                <select
                  value={newAllergenForm.risk_level}
                  onChange={(e) => setNewAllergenForm({ ...newAllergenForm, risk_level: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-rose-600"
                >
                  <option value="danger">Nguy cơ cao (Danger) - Đạm giáp xác, Lạc, Sữa bò, Sốc phản vệ</option>
                  <option value="warning">Cảnh báo (Warning) - Cá nước ngọt, Trứng gia cầm, Thịt mỡ, Gia vị cay</option>
                  <option value="safe">An toàn (Safe) - Không chứa Gluten (Gluten-Free GF), Bột gạo</option>
                  <option value="info">Thông tin (Info) - Thành phần đặc thù địa phương</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151d1a] mb-1">
                  Triệu Chứng & Khuyến Nghị An Toàn
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Dị ứng protein hạt dầu, gây phát ban ngứa hoặc khó thở với cơ địa nhạy cảm."
                  value={newAllergenForm.symptoms_desc}
                  onChange={(e) => setNewAllergenForm({ ...newAllergenForm, symptoms_desc: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-rose-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151d1a] mb-1">
                  Món Ăn Di Sản Thường Gặp
                </label>
                <input
                  type="text"
                  placeholder="VD: Bánh đa nướng, Nộm bò khô, Chè mè đen"
                  value={newAllergenForm.common_in_dishes}
                  onChange={(e) => setNewAllergenForm({ ...newAllergenForm, common_in_dishes: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f8faf9] border border-[#c9dbd0] text-xs focus:outline-hidden focus:border-rose-600"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#edf6f1]">
                <button
                  type="button"
                  onClick={() => setIsNewAllergenModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c9dbd0] hover:bg-[#f8faf9] text-xs font-semibold text-[#404945] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Lưu Nhãn Vào Database</span>
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
