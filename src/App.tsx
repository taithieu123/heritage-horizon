/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { HeritageItem, FoodItem, SensorState, CategoryType } from './types';
import { HERITAGE_LANDMARKS, CULINARY_DISCOVERIES } from './data/mockData';
import { AppBar } from './components/AppBar';
import { BottomNavBar, TabId } from './components/BottomNavBar';
import { SensorLabCard } from './components/SensorLabCard';
import { HeritageCard } from './components/HeritageCard';
import { FoodCard } from './components/FoodCard';
import { ARCameraModal } from './components/ARCameraModal';
import { ItemDetailSheet } from './components/ItemDetailSheet';
import { InteractiveMapTab } from './components/InteractiveMapTab';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { FlutterMobileFrame } from './components/FlutterMobileFrame';
import { QRCodePhoneModal } from './components/QRCodePhoneModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { audioGuide } from './utils/audioGuide';
import {
  Sparkles,
  Compass,
  Camera,
  Navigation,
  Bookmark,
  Volume2,
  Utensils,
  Landmark,
  Search,
  Code2,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [portalMode, setPortalMode] = useState<'admin' | 'mobile'>('admin');
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showFlutterCode, setShowFlutterCode] = useState(false);

  // Modals
  const [isAROpen, setIsAROpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<HeritageItem | FoodItem | null>(null);

  const sharedAppUrl = 'https://ais-pre-wbekbwnini6limrax2wjbc-538544773831.asia-east1.run.app';

  // Dynamic Data from Backend API with local fallback
  const [heritageItems, setHeritageItems] = useState<HeritageItem[]>(HERITAGE_LANDMARKS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(CULINARY_DISCOVERIES);

  // Audio Playback State
  const [activeAudioItemId, setActiveAudioItemId] = useState<string | null>(null);

  // Saved / Bookmarked items
  const [savedIds, setSavedIds] = useState<string[]>(['heritage-1', 'food-1']);

  // Fetch initial data from backend API
  useEffect(() => {
    fetch('/api/heritage')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          setHeritageItems(json.data);
        }
      })
      .catch(() => {});

    fetch('/api/food')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          setFoodItems(json.data);
        }
      })
      .catch(() => {});

    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSavedIds(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Sensor State (Defaults to 60.7° exactly as in Design Spec "Hướng la bàn: 60.7°")
  const [sensorState, setSensorState] = useState<SensorState>({
    compassBearing: 60.7,
    isCompassActive: true,
    coordinates: {
      latitude: 21.0337,
      longitude: 105.8465,
      altitude: 12.4,
      accuracy: 2.8,
    },
    isGpsActive: true,
    isCameraActive: false,
    permissionGranted: false,
  });

  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Real Device Orientation Listener (if device has gyroscope / magnetometer)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      const heading = (event as any).webkitCompassHeading || (event.alpha ? 360 - event.alpha : null);
      if (heading !== null && heading !== undefined) {
        setSensorState((prev) => ({
          ...prev,
          compassBearing: Math.round(heading * 10) / 10,
        }));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Request Real GPS Coordinates
  const handleRequestGps = () => {
    setIsGpsLoading(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSensorState((prev) => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || 14.5,
              accuracy: position.coords.accuracy || 3.0,
            },
            isGpsActive: true,
            permissionGranted: true,
          }));
          setIsGpsLoading(false);
        },
        (error) => {
          console.warn('Geolocation fallback:', error);
          // Fallback to slight simulated drift in Hanoi Old Quarter
          setSensorState((prev) => ({
            ...prev,
            coordinates: {
              latitude: 21.0337 + (Math.random() - 0.5) * 0.002,
              longitude: 105.8465 + (Math.random() - 0.5) * 0.002,
              altitude: 13.0,
              accuracy: 2.5,
            },
          }));
          setIsGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsGpsLoading(false);
    }
  };

  // Toggle Save
  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    fetch(`/api/bookmarks/${id}`, { method: 'POST' }).catch(() => {});
  };

  // Play audio snippet from card
  const handlePlayAudio = (item: HeritageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeAudioItemId === item.id) {
      audioGuide.stopSpeech();
      setActiveAudioItemId(null);
    } else {
      setActiveAudioItemId(item.id);
      audioGuide.speak(`${item.title}. ${item.subtitle}. ${item.audioNarrationText}`, {
        onEnd: () => setActiveAudioItemId(null),
        onError: () => setActiveAudioItemId(null),
      });
    }
  };

  // Filter items based on search and category
  const filteredHeritage = useMemo(() => {
    return heritageItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'food') return false;
      if (selectedCategory === 'audio' && !item.hasAudioTour) return false;
      if (selectedCategory === 'saved' && !savedIds.includes(item.id)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, savedIds, heritageItems]);

  const filteredFood = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialtyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.flavorTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'heritage' || selectedCategory === 'audio') return false;
      if (selectedCategory === 'saved' && !savedIds.includes(item.id)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, savedIds, foodItems]);

  // Handle bottom navigation tabs
  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'saved') {
      setSelectedCategory('saved');
    } else if (selectedCategory === 'saved') {
      setSelectedCategory('all');
    }
  };

  if (portalMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#f3fbf6]">
        <AdminLayout
          onSwitchToMobile={() => setPortalMode('mobile')}
          onOpenARModal={() => setIsAROpen(true)}
        />

        {/* AR Viewport Camera Modal */}
        <ARCameraModal
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
          sensorState={sensorState}
          heritageItems={heritageItems}
          foodItems={foodItems}
          onSelectItem={(item) => setSelectedDetailItem(item)}
          onUpdateBearing={(b) =>
            setSensorState((prev) => ({ ...prev, compassBearing: b }))
          }
        />

        {/* Item Detail Bottom Sheet */}
        <ItemDetailSheet
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          isSaved={selectedDetailItem ? savedIds.includes(selectedDetailItem.id) : false}
          onToggleSave={(id) => handleToggleSave(id)}
          onOpenARWithItem={(item) => {
            setSelectedDetailItem(null);
            setSensorState((prev) => ({
              ...prev,
              compassBearing: item.bearingDegrees,
            }));
            setIsAROpen(true);
          }}
        />

        {/* QR Code Modal for Real Phone Experience */}
        <QRCodePhoneModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          appUrl={sharedAppUrl}
        />
      </div>
    );
  }

  return (
    <FlutterMobileFrame isFrameActive={isMobileFrame}>
      {/* Top Application Bar */}
      <AppBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenAR={() => setIsAROpen(true)}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        compassBearing={sensorState.compassBearing}
        onSwitchToAdmin={() => setPortalMode('admin')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col space-y-6">
        {/* Mobile Search input for small screens */}
        <div className="block md:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#76A286]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm địa danh, di tích, món ngon..."
              className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white border border-[#c9dbd0] text-xs text-[#151d1a] placeholder-[#707974] outline-hidden shadow-xs focus:border-[#1B4D3E]"
            />
            <button
              type="button"
              onClick={() => setIsAROpen(true)}
              className="absolute right-2.5 w-7 h-7 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs"
              title="Mở Camera AR"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Explore & Discover */}
        {activeTab === 'explore' && (
          <>
            {/* Sensor Lab & Telemetry HUD Card matching image design */}
            <SensorLabCard
              sensorState={sensorState}
              onUpdateBearing={(b) =>
                setSensorState((prev) => ({ ...prev, compassBearing: b }))
              }
              onRequestGps={handleRequestGps}
              onToggleCamera={() => setIsAROpen(true)}
              onOpenAR={() => setIsAROpen(true)}
              isGpsLoading={isGpsLoading}
            />

            {/* Filter Pills matching Design Spec Section 4 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setShowFlutterCode(false);
                }}
                className={`h-9 px-4 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === 'all' && !showFlutterCode
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-white border border-[#c9dbd0] text-[#404945] hover:bg-[#e7f0eb]'
                }`}
              >
                Tất cả
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('heritage');
                  setShowFlutterCode(false);
                }}
                className={`h-9 px-4 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === 'heritage' && !showFlutterCode
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-white border border-[#c9dbd0] text-[#404945] hover:bg-[#e7f0eb]'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Di tích & Kiến trúc</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('food');
                  setShowFlutterCode(false);
                }}
                className={`h-9 px-4 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === 'food' && !showFlutterCode
                    ? 'bg-[#D96B27] text-white shadow-xs'
                    : 'bg-white border border-[#c9dbd0] text-[#404945] hover:bg-[#e7f0eb]'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Ẩm thực phố cổ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('audio');
                  setShowFlutterCode(false);
                }}
                className={`h-9 px-4 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === 'audio' && !showFlutterCode
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-white border border-[#c9dbd0] text-[#404945] hover:bg-[#e7f0eb]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Tour âm thanh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowFlutterCode(true);
                }}
                className={`h-9 px-4 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  showFlutterCode
                    ? 'bg-[#003629] text-white shadow-xs ring-2 ring-[#baeed9]'
                    : 'bg-[#edf6f1] border border-[#76A286] text-[#1B4D3E] hover:bg-[#dce6e0]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>Mã nguồn Flutter Dart</span>
              </button>
            </div>

            {/* Flutter Code Viewer Tab if toggled */}
            {showFlutterCode ? (
              <FlutterCodeViewer />
            ) : (
              <>
                {/* Heritage Landmarks Section */}
                {filteredHeritage.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]" />
                        <h2 className="font-display font-bold text-lg text-[#151d1a]">
                          Di Tích Lịch Sử & Danh Thắng
                        </h2>
                      </div>
                      <span className="text-xs text-[#707974]">
                        {filteredHeritage.length} địa điểm gần bạn
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                      {filteredHeritage.map((item) => (
                        <HeritageCard
                          key={item.id}
                          item={item}
                          isSaved={savedIds.includes(item.id)}
                          onSelect={(it) => setSelectedDetailItem(it)}
                          onToggleSave={handleToggleSave}
                          onPlayAudio={handlePlayAudio}
                          isPlayingThisAudio={activeAudioItemId === item.id}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Culinary Discoveries Section */}
                {filteredFood.length > 0 && (
                  <section className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D96B27]" />
                        <h2 className="font-display font-bold text-lg text-[#151d1a]">
                          Ẩm Thực Truyền Thống & Hương Vị Kinh Kỳ
                        </h2>
                      </div>
                      <span className="text-xs text-[#707974]">
                        {filteredFood.length} quán nức tiếng
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                      {filteredFood.map((item) => (
                        <FoodCard
                          key={item.id}
                          item={item}
                          isSaved={savedIds.includes(item.id)}
                          onSelect={(it) => setSelectedDetailItem(it)}
                          onToggleSave={handleToggleSave}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Empty State */}
                {filteredHeritage.length === 0 && filteredFood.length === 0 && (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#c9dbd0] space-y-3">
                    <Search className="w-8 h-8 text-[#76A286] mx-auto" />
                    <h3 className="font-display font-bold text-base text-[#151d1a]">
                      Không tìm thấy kết quả phù hợp
                    </h3>
                    <p className="text-xs text-[#707974] max-w-sm mx-auto">
                      Hãy thử từ khóa khác như "Chùa Một Cột", "Văn Miếu", "Phở", "Chả cá", hoặc xóa bộ lọc.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1B4D3E] text-white text-xs font-semibold hover:bg-[#003629]"
                    >
                      Đặt lại tìm kiếm
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab 2: Dedicated Sensor & AR Hub */}
        {activeTab === 'sensor_ar' && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm">
                  <Compass className="w-6 h-6 text-[#baeed9]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-[#151d1a]">
                    Trung Tâm Cảm Biến Không Gian & AR
                  </h2>
                  <p className="text-xs text-[#707974]">
                    Theo dõi telemetry la bàn, gia tốc trọng trường và tọa độ thời gian thực
                  </p>
                </div>
              </div>

              <SensorLabCard
                sensorState={sensorState}
                onUpdateBearing={(b) =>
                  setSensorState((prev) => ({ ...prev, compassBearing: b }))
                }
                onRequestGps={handleRequestGps}
                onToggleCamera={() => setIsAROpen(true)}
                onOpenAR={() => setIsAROpen(true)}
                isGpsLoading={isGpsLoading}
              />
            </div>

            {/* AR Teaser Hero Card */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#192823] p-6 sm:p-8 flex flex-col justify-end text-white shadow-lg border border-[#76A286]/30">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{
                  backgroundImage: `url('/src/assets/images/ar_hanoi_view_1793939014182.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121E19] via-[#121E19]/50 to-transparent" />

              <div className="relative z-10 space-y-2 max-w-lg">
                <span className="px-3 py-1 rounded-full bg-[#1B4D3E] text-[#baeed9] text-xs font-mono font-semibold">
                  GÓC NHÌN 360° ĐỊA DANH
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  Quét Không Gian Thực Với Nhãn AR
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Hướng camera vào đường phố để nhìn thấy khoảng cách và vị trí các di tích nghìn năm tuổi ngay trong tầm mắt.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAROpen(true)}
                    className="h-11 px-5 rounded-xl bg-[#D96B27] hover:bg-[#b85418] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Mở Camera Viewfinder AR Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Map */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-[#151d1a]">
                  Bản Đồ Di Sản & Radar Khoảng Cách
                </h2>
                <p className="text-xs text-[#707974]">
                  Khoanh vùng các điểm đến theo tia hướng la bàn của bạn
                </p>
              </div>
            </div>

            <InteractiveMapTab
              heritageItems={heritageItems}
              foodItems={foodItems}
              sensorState={sensorState}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              onOpenAR={() => setIsAROpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Saved Items */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display font-bold text-xl text-[#151d1a]">
                Bộ Sưu Tập Đã Lưu ({savedIds.length})
              </h2>
              <p className="text-xs text-[#707974]">
                Danh sách di tích và quán ngon yêu thích sẵn sàng cho hành trình thực địa
              </p>
            </div>

            {savedIds.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#c9dbd0] space-y-3">
                <Bookmark className="w-8 h-8 text-[#76A286] mx-auto" />
                <h3 className="font-display font-bold text-base text-[#151d1a]">
                  Chưa có địa điểm nào được lưu
                </h3>
                <p className="text-xs text-[#707974]">
                  Chạm vào biểu tượng dấu trang trên các thẻ địa danh để lưu lại cho chuyến đi của bạn.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 rounded-xl bg-[#1B4D3E] text-white text-xs font-semibold"
                >
                  Khám phá địa danh ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heritageItems.filter((item) => savedIds.includes(item.id)).map((item) => (
                  <HeritageCard
                    key={item.id}
                    item={item}
                    isSaved={true}
                    onSelect={(it) => setSelectedDetailItem(it)}
                    onToggleSave={handleToggleSave}
                    onPlayAudio={handlePlayAudio}
                    isPlayingThisAudio={activeAudioItemId === item.id}
                  />
                ))}
                {foodItems.filter((item) => savedIds.includes(item.id)).map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    isSaved={true}
                    onSelect={(it) => setSelectedDetailItem(it)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Flutter Mobile-style Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        savedCount={savedIds.length}
      />

      {/* AR Viewport Camera Modal */}
      <ARCameraModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        sensorState={sensorState}
        heritageItems={heritageItems}
        foodItems={foodItems}
        onSelectItem={(item) => setSelectedDetailItem(item)}
        onUpdateBearing={(b) =>
          setSensorState((prev) => ({ ...prev, compassBearing: b }))
        }
      />

      {/* Item Detail Bottom Sheet */}
      <ItemDetailSheet
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        isSaved={selectedDetailItem ? savedIds.includes(selectedDetailItem.id) : false}
        onToggleSave={(id) => handleToggleSave(id)}
        onOpenARWithItem={(item) => {
          setSelectedDetailItem(null);
          setSensorState((prev) => ({
            ...prev,
            compassBearing: item.bearingDegrees,
          }));
          setIsAROpen(true);
        }}
      />

      {/* Quick Floating Admin Entry Button for Mobile */}
      <div className="fixed bottom-20 left-4 z-20 md:hidden">
        <button
          type="button"
          onClick={() => setPortalMode('admin')}
          className="h-9 px-3.5 rounded-full bg-[#1B4D3E] text-white shadow-lg border border-[#baeed9]/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          title="Chuyển sang CMS Quản trị Di sản"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#baeed9]" />
          <span>Vào CMS Quản Trị</span>
        </button>
      </div>

      {/* QR Code Modal for Real Phone Experience */}
      <QRCodePhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        appUrl={sharedAppUrl}
      />
    </FlutterMobileFrame>
  );
}
