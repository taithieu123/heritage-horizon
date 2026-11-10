import React, { useState, useEffect } from 'react';
import {
  Database,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Layers,
  KeyRound,
  CheckCircle2,
  FileCode,
  ExternalLink,
  Code2,
  Table,
  MapPin,
} from 'lucide-react';

export const AdminDatabaseTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'preview' | 'schema'>('guide');
  const [fullSqlContent, setFullSqlContent] = useState<string>('');

  const sqlFilePath = '/database/mysql_workbench_schema.sql';

  useEffect(() => {
    fetch('/database/mysql_workbench_schema.sql')
      .then((res) => res.text())
      .then((text) => setFullSqlContent(text))
      .catch(() => {});
  }, []);

  const sampleProcedureCall = `USE heritage_horizon_db;

-- 1. Xem danh sách di tích văn hóa (vị trí đã được gộp gọn gàng: Địa chỉ | Tọa độ GPS)
SELECT name, category, badge, location, ar_heading, rating 
FROM heritage_landmarks;

-- 2. Xem danh sách quán ăn đã thẩm định (vị trí gộp: Địa chỉ | GPS RTK)
SELECT name, specialty_dish, location, verification_status 
FROM restaurants;

-- 3. Xem danh mục món ăn và thành phần dị ứng FR08 gộp
SELECT name, origin_region, allergens_fr08, price_range, total_restaurants 
FROM culinary_items;`;

  const handleCopySQL = () => {
    // Fetch and copy the SQL file
    fetch('/database/mysql_workbench_schema.sql')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        navigator.clipboard.writeText(sampleProcedureCall);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  const handleDownloadSQL = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/database/mysql_workbench_schema.sql');
    element.setAttribute('download', 'heritage_horizon_mysql_workbench.sql');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-[#76A286] tracking-wider uppercase font-mono">
              HẠ TẦNG CƠ SỞ DỮ LIỆU TINH GỌN (GỘP CỘT VỊ TRÍ)
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#151d1a]">
            Cơ sở Dữ liệu MySQL Workbench (heritage_horizon_db)
          </h1>
          <p className="text-xs text-[#707974] mt-0.5 max-w-3xl">
            Tập lệnh SQL tinh gọn dành cho MySQL Workbench: 4 bảng cô đọng, gộp toàn bộ kinh độ, vĩ độ và địa chỉ vào 1 cột vị trí duy nhất, dễ dàng tạo và truy vấn nhanh chóng.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleCopySQL}
            className="h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#baeed9]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSQL}
            className="h-10 px-4 rounded-xl bg-white hover:bg-[#edf6f1] border border-[#c9dbd0] text-[#1B4D3E] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D96B27]" />
            <span>Tải tệp .sql về máy</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              BẢNG TINH GỌN
            </span>
            <span className="font-display font-extrabold text-2xl text-[#151d1a] block mt-1">
              4 Bảng
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Không rườm rà, dễ mở rộng
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#edf6f1] text-[#1B4D3E] flex items-center justify-center">
            <Table className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              CỘT VỊ TRÍ GỘP
            </span>
            <span className="font-display font-extrabold text-lg text-emerald-700 block mt-1 font-mono">
              1 Cột Location
            </span>
            <span className="text-[11px] text-[#707974] font-medium">
              Địa chỉ + GPS WGS84
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TOÁN HỌC KHÔNG GIAN
            </span>
            <span className="font-display font-extrabold text-lg text-[#151d1a] block mt-1">
              Haversine SP
            </span>
            <span className="text-[11px] text-[#707974] font-medium">
              Bán kính Geofence m/km
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D96B27] flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#c9dbd0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider block">
              TƯƠNG THÍCH MÁY CHỦ
            </span>
            <span className="font-display font-extrabold text-lg text-[#151d1a] block mt-1">
              MySQL 8.0+
            </span>
            <span className="text-[11px] text-[#707974] font-medium">
              MySQL Workbench / MariaDB
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#c9dbd0] pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('guide')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'guide'
              ? 'bg-[#1B4D3E] text-white shadow-2xs'
              : 'text-[#404945] hover:bg-[#edf6f1]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Hướng dẫn Thực thi trên MySQL Workbench</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('schema')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'schema'
              ? 'bg-[#1B4D3E] text-white shadow-2xs'
              : 'text-[#404945] hover:bg-[#edf6f1]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Sơ đồ 8 Bảng & Ràng buộc Khóa ngoại</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'preview'
              ? 'bg-[#1B4D3E] text-white shadow-2xs'
              : 'text-[#404945] hover:bg-[#edf6f1]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Mã lệnh SQL & Truy vấn Thử nghiệm</span>
        </button>
      </div>

      {/* Tab 1: Step by Step Guide */}
      {activeSubTab === 'guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-6">
              <h3 className="font-display font-bold text-base text-[#151d1a] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#1B4D3E]" />
                Các bước thực hiện trong MySQL Workbench để tạo Cơ sở dữ liệu:
              </h3>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4 p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
                  <div className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#151d1a]">
                      Khởi động MySQL Workbench & Đăng nhập Connection
                    </h4>
                    <p className="text-[11px] text-[#404945] leading-relaxed">
                      Mở ứng dụng <strong>MySQL Workbench</strong> trên máy tính của bạn. Chọn kết nối MySQL của bạn (thường là <em>Local instance 3306</em> với user <code>root</code>), nhập mật khẩu và nhấn <strong>OK</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
                  <div className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#151d1a]">
                      Mở tệp SQL hoặc Dán mã Script
                    </h4>
                    <p className="text-[11px] text-[#404945] leading-relaxed">
                      Trên thanh công cụ Workbench, chọn menu <strong>File &gt; Open SQL Script...</strong> (hoặc nhấn phím tắt <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">Ctrl + Shift + O</kbd> trên Windows, <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">Cmd + Shift + O</kbd> trên Mac), và chọn tệp <code className="text-[#1B4D3E] font-bold">database/mysql_workbench_schema.sql</code>.
                    </p>
                    <p className="text-[11px] text-[#707974]">
                      <em>(Hoặc bấm nút "Sao chép toàn bộ SQL" ở trên rồi mở tab truy vấn mới <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">Ctrl + T</kbd> và dán trực tiếp).</em>
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
                  <div className="w-8 h-8 rounded-full bg-[#D96B27] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#151d1a]">
                      Thực thi Query (Execute Script)
                    </h4>
                    <p className="text-[11px] text-[#404945] leading-relaxed">
                      Nhấn vào biểu tượng <strong>Tia sét màu vàng ⚡</strong> ở góc trên khung soạn thảo, hoặc nhấn phím tắt <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">Ctrl + Shift + Enter</kbd>. Toàn bộ 8 bảng, các khóa ngoại, dữ liệu mẫu và Stored Procedure sẽ được khởi tạo hoàn tất trong 1-2 giây.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 p-4 rounded-xl bg-[#f8faf9] border border-[#e3ece7]">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#151d1a]">
                      Làm mới (Refresh) Schemas & Kiểm tra Kết quả
                    </h4>
                    <p className="text-[11px] text-[#404945] leading-relaxed">
                      Tại bảng điều khiển <strong>Navigator</strong> phía bên trái, chuyển sang tab <strong>Schemas</strong>, nhấn chuột phải và chọn <strong>Refresh All</strong> (hoặc nhấn <kbd className="px-1.5 py-0.5 rounded bg-gray-200 font-mono text-[10px]">F5</kbd>). Bạn sẽ thấy xuất hiện cơ sở dữ liệu <code className="text-[#1B4D3E] font-bold">heritage_horizon_db</code> với đầy đủ 8 Tables, Views và Stored Procedures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Test Code */}
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#76A286] uppercase block">
                  CÂU LỆNH TEST NHANH
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#151d1a]">
                Test Stored Procedure Không gian
              </h4>
              <p className="text-[11px] text-[#707974] leading-relaxed">
                Sau khi tạo database, bạn hãy mở một tab query mới trong Workbench và chạy thử lệnh sau để tìm di tích & quán ăn gần bạn:
              </p>

              <div className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                <pre>{sampleProcedureCall}</pre>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(sampleProcedureCall);
                  alert('Đã sao chép câu lệnh test mẫu!');
                }}
                className="w-full h-9 rounded-xl bg-[#edf6f1] hover:bg-[#dce6e0] text-[#1B4D3E] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép câu lệnh Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schema Structure */}
      {activeSubTab === 'schema' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#1B4D3E]" />
              <h4 className="font-bold text-xs text-[#151d1a]">1. users (Người dùng & Phân quyền)</h4>
            </div>
            <p className="text-[11px] text-[#707974]">
              Rút gọn phân quyền Super Admin, Thẩm định viên thực địa, Điều phối viên AR.
            </p>
            <div className="p-2.5 rounded-xl bg-[#f8faf9] text-[10px] font-mono space-y-1 text-[#404945]">
              <p>• <strong>id</strong> (PK), <strong>full_name</strong>, <strong>email</strong> (UNIQUE)</p>
              <p>• <strong>role</strong> (Super Admin / Auditor / AR Coordinator), <strong>status</strong></p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#1B4D3E]" />
              <h4 className="font-bold text-xs text-[#151d1a]">2. heritage_landmarks (Di tích & 1 Cột Vị trí)</h4>
            </div>
            <p className="text-[11px] text-[#707974]">
              Gộp toàn bộ địa chỉ, kinh độ, vĩ độ vào 1 cột <code>location</code> duy nhất.
            </p>
            <div className="p-2.5 rounded-xl bg-[#f8faf9] text-[10px] font-mono space-y-1 text-[#404945]">
              <p>• <strong>id</strong> (PK), <strong>code</strong> (UNIQUE), <strong>name</strong>, <strong>category</strong>, <strong>badge</strong></p>
              <p>• <strong className="text-emerald-700">location</strong> (Địa chỉ | Tọa độ WGS84: 21.0359, 105.8336)</p>
              <p>• <strong>ar_heading</strong> (Góc la bàn), <strong>rating</strong>, <strong>image_url</strong></p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#D96B27]" />
              <h4 className="font-bold text-xs text-[#151d1a]">3. culinary_items (Món ăn & Dị ứng FR08)</h4>
            </div>
            <p className="text-[11px] text-[#707974]">
              Gộp toàn bộ nhãn cảnh báo dị ứng quốc tế FR08 vào 1 cột <code>allergens_fr08</code>.
            </p>
            <div className="p-2.5 rounded-xl bg-[#f8faf9] text-[10px] font-mono space-y-1 text-[#404945]">
              <p>• <strong>id</strong> (PK), <strong>code</strong>, <strong>name</strong>, <strong>origin_region</strong></p>
              <p>• <strong className="text-[#D96B27]">allergens_fr08</strong> (Chứa mắm tôm, Lạc rang, Không Gluten...)</p>
              <p>• <strong>price_range</strong>, <strong>total_restaurants</strong></p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-xs text-[#151d1a]">4. restaurants (Quán ăn & 1 Cột Vị trí)</h4>
            </div>
            <p className="text-[11px] text-[#707974]">
              Gộp toàn bộ địa chỉ, kinh độ, vĩ độ và sai số RTK vào 1 cột <code>location</code> duy nhất.
            </p>
            <div className="p-2.5 rounded-xl bg-[#f8faf9] text-[10px] font-mono space-y-1 text-[#404945]">
              <p>• <strong>id</strong> (PK), <strong>code</strong>, <strong>name</strong>, <strong>owner_name</strong>, <strong>specialty_dish</strong></p>
              <p>• <strong className="text-emerald-700">location</strong> (Địa chỉ | Tọa độ RTK: 21.0189, 105.8532)</p>
              <p>• <strong>verification_status</strong> (Verified / Pending / Need Inspection)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SQL Preview */}
      {activeSubTab === 'preview' && (
        <div className="p-5 bg-white rounded-2xl border border-[#c9dbd0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#151d1a]">
              Tệp SQL nguồn: <code>/database/mysql_workbench_schema.sql</code> (115 dòng tinh gọn)
            </span>
            <button
              type="button"
              onClick={handleCopySQL}
              className="px-3 py-1.5 rounded-lg bg-[#1B4D3E] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép toàn bộ</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-gray-950 text-emerald-300 font-mono text-xs max-h-96 overflow-y-auto leading-relaxed">
            <pre>{fullSqlContent || sampleProcedureCall}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
