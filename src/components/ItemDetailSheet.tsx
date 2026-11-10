import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Bookmark, Navigation, MapPin, Share2, Compass, Music, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeritageItem, FoodItem } from '../types';
import { audioGuide } from '../utils/audioGuide';

interface ItemDetailSheetProps {
  item: HeritageItem | FoodItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenARWithItem: (item: HeritageItem | FoodItem) => void;
}

export const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({
  item,
  onClose,
  isSaved,
  onToggleSave,
  onOpenARWithItem,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    // Stop audio when closing or changing item
    return () => {
      audioGuide.stopSpeech();
    };
  }, [item]);

  if (!item) return null;

  const isHeritage = item.category === 'heritage';
  const heritageItem = isHeritage ? (item as HeritageItem) : null;
  const foodItem = !isHeritage ? (item as FoodItem) : null;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      audioGuide.stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const textToRead = isHeritage
        ? `${heritageItem?.title}. ${heritageItem?.subtitle}. ${heritageItem?.audioNarrationText} Lời khuyên cho du khách: ${heritageItem?.tipsForVisitors}`
        : `${foodItem?.name}. Món đặc sản: ${foodItem?.specialtyName}. Câu chuyện ẩm thực: ${foodItem?.heritageStory}. Bí quyết thưởng thức: ${foodItem?.mustTryTip}`;

      const started = audioGuide.speak(textToRead, {
        rate: speechRate,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
      if (started) {
        setIsPlayingAudio(true);
      }
    }
  };

  const handleToggleAmbient = () => {
    const newState = audioGuide.toggleAmbientSound();
    setIsAmbientOn(newState);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleOpenGoogleMaps = () => {
    const { lat, lng } = item.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Sheet Container */}
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#fbfbf9] rounded-t-3xl sm:rounded-3xl shadow-[0_16px_36px_-6px_rgba(18,30,25,0.25)] border border-[rgba(118,162,134,0.25)] flex flex-col overflow-hidden z-10">
        {/* Grab handle for touch gestures */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-[#c0c9c3] rounded-full" />
        </div>

        {/* Header photo & controls */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#232B28]">
          <img
            src={item.imageUrl}
            alt={'title' in item ? item.title : item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top action buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Góc {item.bearingDegrees}° · {item.distanceMeters}m</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                title="Chia sẻ liên kết"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onToggleSave(item.id)}
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                  isSaved ? 'bg-[#1B4D3E] text-white' : 'bg-black/50 text-white hover:bg-black/70'
                }`}
                title={isSaved ? 'Đã lưu' : 'Lưu'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title on image bottom */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
              {'title' in item ? item.title : item.name}
            </h2>
            <p className="text-xs text-white/80 mt-1 line-clamp-1">
              {'subtitle' in item ? item.subtitle : item.specialtyName}
            </p>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Audio Tour HUD Card */}
          <div className="p-3.5 rounded-2xl bg-[#edf6f1] border border-[#c9dbd0] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B4D3E] uppercase font-display">
                    {isHeritage ? 'Tour Thuyết Minh Âm Thanh' : 'Giới Thiệu Ẩm Thực Tự Động'}
                  </h4>
                  <p className="text-[11px] text-[#404945]">Giọng đọc tiếng Việt bản địa tự nhiên</p>
                </div>
              </div>

              {/* Ambient Temple/Flute music toggle */}
              <button
                type="button"
                onClick={handleToggleAmbient}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAmbientOn
                    ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                    : 'bg-white text-[#404945] border-[#c0c9c3] hover:bg-[#e7f0eb]'
                }`}
                title="Bật âm vang chuông chùa & tiếng sáo thiền tĩnh lặng"
              >
                <Music className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>{isAmbientOn ? 'Nhạc thiền: Bật' : 'Nhạc thiền'}</span>
              </button>
            </div>

            {/* Play narration control bar */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleToggleAudio}
                className="flex-1 h-10 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Tạm dừng thuyết minh</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lắng nghe câu chuyện di sản</span>
                  </>
                )}
              </button>

              {/* Speed selector */}
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="h-10 px-2.5 rounded-xl bg-white border border-[#c9dbd0] text-xs font-medium text-[#1B4D3E] cursor-pointer"
              >
                <option value={0.85}>0.85x Chậm</option>
                <option value={1.0}>1.0x Chuẩn</option>
                <option value={1.25}>1.25x Nhanh</option>
              </select>
            </div>
          </div>

          {/* Heritage Landmark Specific Lore */}
          {heritageItem && (
            <>
              <div>
                <h3 className="font-display font-bold text-sm text-[#1B4D3E] uppercase tracking-wider mb-2">
                  Lịch Sử & Kiến Trúc
                </h3>
                <p className="text-xs sm:text-sm text-[#404945] leading-relaxed">
                  {heritageItem.description}
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-[#1B4D3E] uppercase tracking-wider mb-2">
                  Đặc Trưng Kiến Trúc Độc Bản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {heritageItem.architecturalHighlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#dfe8e2] flex items-start gap-2 text-xs text-[#232B28]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1B4D3E] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fff8f2] border border-[#ffdbcb] text-xs text-[#521f00]">
                <strong className="block text-[#D96B27] font-semibold mb-1">Mẹo tham quan di sản:</strong>
                <p>{heritageItem.tipsForVisitors}</p>
              </div>
            </>
          )}

          {/* Culinary Specific Lore */}
          {foodItem && (
            <>
              <div>
                <h3 className="font-display font-bold text-sm text-[#D96B27] uppercase tracking-wider mb-2">
                  Giai Thoại Hương Vị Gia Truyền
                </h3>
                <p className="text-xs sm:text-sm text-[#404945] leading-relaxed">
                  {foodItem.heritageStory}
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-[#D96B27] uppercase tracking-wider mb-2">
                  Món Ngon Nên Thử
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {foodItem.recommendedDishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#dfe8e2] flex items-center gap-2 text-xs text-[#232B28]"
                    >
                      <Sparkles className="w-4 h-4 text-[#D96B27] shrink-0" />
                      <span className="font-medium">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fff8f2] border border-[#ffdbcb] text-xs text-[#521f00]">
                <strong className="block text-[#D96B27] font-semibold mb-1">Bí quyết thưởng thức trọn vị:</strong>
                <p>{foodItem.mustTryTip}</p>
              </div>
            </>
          )}

          {/* Address & Coordinates */}
          <div className="p-3 rounded-xl bg-white border border-[#dfe8e2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <div className="truncate">
                <span className="font-medium text-[#151d1a] block truncate">{item.address}</span>
                <span className="text-[11px] text-[#707974] font-mono">
                  GPS: {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer sticky action buttons */}
        <div className="p-4 bg-white border-t border-[#edf6f1] flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenARWithItem(item)}
            className="flex-1 h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98 transition-all"
          >
            <Compass className="w-4 h-4 text-[#baeed9]" />
            <span>Ngắm qua AR Viewport</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGoogleMaps}
            className="h-12 px-4 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] text-[#1B4D3E] border border-[#c9dbd0] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#1B4D3E]" />
            <span className="hidden sm:inline">Chỉ đường</span>
          </button>
        </div>

        {/* Toast Notification */}
        {copiedNotification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1B4D3E] text-white text-xs shadow-lg animate-bounce">
            Đã sao chép liên kết vào bộ nhớ tạm!
          </div>
        )}
      </div>
    </div>
  );
};
