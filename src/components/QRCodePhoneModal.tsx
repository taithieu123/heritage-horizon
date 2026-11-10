import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, ExternalLink, Apple, Sparkles } from 'lucide-react';

interface QRCodePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const QRCodePhoneModal: React.FC<QRCodePhoneModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'flutter_cli'>('scan');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=ffffff&color=1B4D3E&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#fbfbf9] rounded-3xl shadow-2xl border border-[#c9dbd0] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1B4D3E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#baeed9]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Chạy Ứng Dụng Trên Điện Thoại Thật</h3>
              <p className="text-[11px] text-[#8abda9]">Kích hoạt cảm biến la bàn, GPS & Camera AR thực tế</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 pb-2 bg-white border-b border-[#edf6f1] flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'bg-[#edf6f1] text-[#404945] hover:bg-[#dce6e0]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Cách 1: Quét mã QR (Chạy ngay lập tức)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flutter_cli')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flutter_cli'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'bg-[#edf6f1] text-[#404945] hover:bg-[#dce6e0]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Cách 2: Build Flutter Native</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'scan' ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white rounded-2xl border-2 border-[#1B4D3E]/30 shadow-md">
                <img
                  src={qrImageUrl}
                  alt="QR Code mở ứng dụng"
                  className="w-52 h-52 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to text if offline
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="font-display font-bold text-sm text-[#151d1a]">
                  Mở Camera điện thoại và quét mã QR ở trên
                </p>
                <p className="text-xs text-[#707974] max-w-sm">
                  Ứng dụng sẽ mở ngay lập tức trên Safari (iPhone) hoặc Chrome (Android), hỗ trợ toàn bộ cảm biến con quay hồi chuyển, la bàn 360° và camera AR thực.
                </p>
              </div>

              {/* URL Direct Link & Copy */}
              <div className="w-full flex items-center gap-2 p-2 bg-[#edf6f1] rounded-xl border border-[#c9dbd0]">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent text-xs text-[#1B4D3E] font-mono px-2 outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-8 px-3 rounded-lg bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#baeed9]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
                </button>
              </div>

              {/* Guide to install as PWA app icon on Phone */}
              <div className="w-full text-left p-3.5 rounded-xl bg-white border border-[#dfe8e2] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#1B4D3E]">
                  <Sparkles className="w-4 h-4 text-[#D96B27]" />
                  <span>Cách cài icon thành App như trên App Store:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#404945]">
                  <div className="p-2.5 rounded-lg bg-[#edf6f1]/60 border border-[#c9dbd0]/50">
                    <strong className="block text-[#1B4D3E] mb-1">Trên iPhone (Safari):</strong>
                    Bấm biểu tượng <strong>Chia sẻ (Share)</strong> ở thanh dưới Safari &rarr; Chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#edf6f1]/60 border border-[#c9dbd0]/50">
                    <strong className="block text-[#1B4D3E] mb-1">Trên Android (Chrome):</strong>
                    Bấm dấu <strong>3 chấm góc trên</strong> &rarr; Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-[#404945]">
              <div className="p-3 bg-[#edf6f1] rounded-xl border border-[#c9dbd0] text-[#1B4D3E]">
                <strong>Cách chạy bằng cáp USB kết nối điện thoại:</strong> Bạn cần máy tính đã cài đặt Flutter SDK và Android Studio (hoặc Xcode cho iPhone).
              </div>

              <div className="space-y-2 font-mono bg-[#151d1a] text-white p-3.5 rounded-xl">
                <p className="text-[#8abda9] font-sans font-bold">1. Tạo dự án Flutter mới:</p>
                <div className="text-[#baeed9]">flutter create heritage_horizon</div>
                <div className="text-[#baeed9]">cd heritage_horizon</div>

                <p className="text-[#8abda9] font-sans font-bold mt-2">2. Thêm các thư viện cảm biến:</p>
                <div className="text-[#baeed9]">flutter pub add sensors_plus geolocator camera</div>

                <p className="text-[#8abda9] font-sans font-bold mt-2">3. Copy code vào file lib/main.dart:</p>
                <div className="text-gray-400 font-sans text-[11px]">
                  (Vào tab "Mã nguồn Flutter Dart" trong app và bấm "Sao chép mã Flutter")
                </div>

                <p className="text-[#8abda9] font-sans font-bold mt-2">4. Cắm cáp USB vào điện thoại và chạy:</p>
                <div className="text-[#baeed9]">flutter run</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#dfe8e2]">
                <strong className="text-[#151d1a] block mb-1">Lưu ý cho Android:</strong>
                Vào Cài đặt điện thoại &rarr; Tùy chọn nhà phát triển &rarr; Bật <strong>"Gỡ lỗi qua USB" (USB Debugging)</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-[#edf6f1] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#edf6f1] text-[#1B4D3E] font-semibold text-xs hover:bg-[#dce6e0] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
