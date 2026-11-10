import React, { useState } from 'react';
import { Copy, Check, Code2, Download, Smartphone, Info } from 'lucide-react';

export const FlutterCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const flutterCode = `// lib/main.dart
// Ứng dụng Heritage & Horizon Discovery - Khám phá Di sản & AR
// Thiết kế theo chuẩn Material 3 & Clean Architecture

import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const HeritageHorizonApp());
}

/// Bảng màu Heritage & Horizon Discovery
class HeritageColors {
  static const Color primary = Color(0xFF1B4D3E); // Deep Imperial Emerald
  static const Color secondary = Color(0xFF76A286); // Herbal Sage
  static const Color tertiary = Color(0xFFD96B27); // Terracotta Spice
  static const Color surface = Color(0xFFF3FBF6);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color darkSlate = Color(0xFF232B28);
}

class HeritageHorizonApp extends StatelessWidget {
  const HeritageHorizonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Heritage & Horizon Discovery',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: HeritageColors.surface,
        colorScheme: ColorScheme.fromSeed(
          seedColor: HeritageColors.primary,
          primary: HeritageColors.primary,
          secondary: HeritageColors.secondary,
          tertiary: HeritageColors.tertiary,
          surface: HeritageColors.surface,
        ),
        fontFamily: 'BeVietnamPro',
      ),
      home: const MainDiscoveryScreen(),
    );
  }
}

class MainDiscoveryScreen extends StatefulWidget {
  const MainDiscoveryScreen({super.key});

  @override
  State<MainDiscoveryScreen> createState() => _MainDiscoveryScreenState();
}

class _MainDiscoveryScreenState extends State<MainDiscoveryScreen> {
  int _currentIndex = 0;
  double _compassBearing = 60.7; // Hướng la bàn mẫu

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: HeritageColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.explore, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Heritage & Horizon',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: HeritageColors.darkSlate,
                  ),
                ),
                Text(
                  'Hà Nội · Phố Cổ & Di Sản',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.camera_alt_outlined, color: HeritageColors.primary),
            onPressed: () => _openARCamera(context),
          ),
        ],
      ),
      body: _buildCurrentBody(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.explore_outlined), label: 'Khám phá'),
          NavigationDestination(icon: Icon(Icons.sensors), label: 'Cảm biến AR'),
          NavigationDestination(icon: Icon(Icons.map_outlined), label: 'Bản đồ'),
          NavigationDestination(icon: Icon(Icons.bookmark_outline), label: 'Đã lưu'),
        ],
      ),
    );
  }

  Widget _buildCurrentBody() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Phòng thí nghiệm cảm biến & Telemetry Card
          _buildSensorTelemetryCard(),
          const SizedBox(height: 20),

          // Danh mục di sản
          const Text(
            'Di Tích Lịch Sử & Kiến Trúc',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildHeritageCard(
            title: 'Chùa Một Cột',
            subtitle: 'Liên hoa đài nghìn năm Thăng Long',
            distance: '250m',
            bearing: '60.7° Đông Bắc',
          ),
          const SizedBox(height: 20),

          // Danh mục ẩm thực
          const Text(
            'Ẩm Thực Phố Cổ & Gia Truyền',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildFoodCard(
            title: 'Phở Bò Bát Đàn',
            price: '55.000đ',
            spice: 'Cay nhẹ',
            distance: '180m',
          ),
        ],
      ),
    );
  }

  Widget _buildSensorTelemetryCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F6F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFC9DBD0)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'PHÒNG THÍ NGHIỆM CẢM BIẾN',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: HeritageColors.primary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Hướng: \${_compassBearing.toStringAsFixed(1)}°',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Custom Compass Painter
          SizedBox(
            height: 70,
            width: 70,
            child: Transform.rotate(
              angle: _compassBearing * (math.pi / 180),
              child: const Icon(Icons.navigation, size: 40, color: HeritageColors.tertiary),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.my_location, size: 16),
                  label: const Text('Lấy GPS'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: HeritageColors.primary,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _openARCamera(context),
                  icon: const Icon(Icons.camera_alt, size: 16),
                  label: const Text('Bật Camera AR'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: HeritageColors.primary,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeritageCard({
    required String title,
    required String subtitle,
    required String distance,
    required String bearing,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 160,
            color: Colors.grey[300],
            child: const Center(child: Icon(Icons.image, size: 48, color: Colors.grey)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(distance, style: const TextStyle(color: HeritageColors.primary)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFoodCard({
    required String title,
    required String price,
    required String spice,
    required String distance,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.restaurant, color: HeritageColors.tertiary),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 4),
                  Text(price, style: const TextStyle(color: HeritageColors.tertiary, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('$distance · $spice', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openARCamera(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.black,
      builder: (_) => Container(
        height: MediaQuery.of(context).size.height * 0.9,
        padding: const EdgeInsets.all(16),
        child: const Center(
          child: Text(
            'AR Viewport: Đang kết nối cảm biến la bàn và camera...',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(flutterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#c9dbd0] p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#edf6f1]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003629] text-white flex items-center justify-center shadow-xs">
            <Code2 className="w-5 h-5 text-[#baeed9]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#151d1a]">
              Mã Nguồn Flutter / Dart (Mobile SDK)
            </h3>
            <p className="text-xs text-[#707974]">
              Tệp mã nguồn <span className="font-mono text-[#1B4D3E]">lib/main.dart</span> hoàn chỉnh sẵn sàng cho Flutter 3.x
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#003629] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
        >
          {copied ? <Check className="w-4 h-4 text-[#baeed9]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Đã sao chép Dart code!' : 'Sao chép mã Flutter'}</span>
        </button>
      </div>

      {/* Guide notice */}
      <div className="p-3.5 rounded-xl bg-[#edf6f1] border border-[#c9dbd0] text-xs text-[#1B4D3E] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#1B4D3E] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Thông tin triển khai:</strong> Ứng dụng hiện tại đang chạy mượt mà ngay trên môi trường Web này với giao diện mô phỏng điện thoại và kiến trúc widget mô phỏng Flutter (AppBar, Scaffold, BottomNavigationBar, Camera Viewport). Bạn có thể sao chép đoạn mã Flutter Dart bên dưới để import thẳng vào dự án Flutter trên Android Studio hoặc VS Code.
        </div>
      </div>

      {/* Code Display */}
      <div className="relative rounded-xl overflow-hidden border border-[#232B28]/20 bg-[#151d1a] text-white font-mono text-xs max-h-[480px] overflow-y-auto p-4 leading-relaxed">
        <pre>
          <code>{flutterCode}</code>
        </pre>
      </div>
    </div>
  );
};
