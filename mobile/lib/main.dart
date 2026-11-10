// Flutter Mobile Application - Heritage & Horizon Discovery
// Comprehensive Physical Device Support:
// 1. Smart AR Viewfinder: Real Camera Stream, AI Optical Target Lock, Staggered Depth Scaling,
//    Artificial Horizon Pitch Ladder, On-Camera Category Filter Pills, Walking ETA & Off-Screen Beacons.
// 2. High-Precision Sensor Fusion: Damped Circular Interpolation, Compass Heading Tape with Landmark Ticks.
// 3. Smart Interactive Map HUD: Dynamic Walking Route Beam, Real-Time Radar Sweep, Walking/Riding ETA,
//    Area Culture Intelligence Summary, and Interactive Place Inspection.

import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_tts/flutter_tts.dart';

List<CameraDescription> _availableCameras = [];

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  try {
    _availableCameras = await availableCameras();
  } catch (e) {
    debugPrint('Hardware camera init error (fallback to sensor simulation): $e');
  }

  runApp(const HeritageHorizonApp());
}

class HeritageHorizonApp extends StatelessWidget {
  const HeritageHorizonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Heritage & Horizon',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF3FBF6),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1B4D3E),
          primary: const Color(0xFF1B4D3E),
          secondary: const Color(0xFF76A286),
          tertiary: const Color(0xFFD96B27),
          surface: const Color(0xFFF3FBF6),
        ),
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  // --- LOCATION & AREA SCANNING STATE ---
  double _activeLatitude = 10.7769; // TP.HCM Dinh Độc Lập / Bến Thành
  double _activeLongitude = 106.6953;
  double _realGpsLatitude = 10.7769;
  double _realGpsLongitude = 106.6953;
  double _gpsAccuracy = 3.5;
  bool _isRealGpsMode = true;
  String _activeLocationName = 'TP. Hồ Chí Minh (Sài Gòn)';
  bool _isGpsLoading = false;

  // Area Scanning Radius (in meters)
  double _analysisRadiusMeters = 3000.0;

  // Hardware Compass Sensor State
  double _compassBearing = 45.0;
  StreamSubscription<MagnetometerEvent>? _magnetometerSub;
  StreamSubscription<AccelerometerEvent>? _accelerometerSub;
  bool _hasHardwareCompass = false;

  // Search & Filter State
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedFoodCategory = 'all';

  // TTS Audio Guide
  final FlutterTts _flutterTts = FlutterTts();
  bool _isPlayingTTS = false;
  String? _speakingId;

  // Bookmarks
  final Set<String> _bookmarkedIds = {'saigon-food-1', 'saigon-1'};

  // Selected Place on Map
  Map<String, dynamic>? _selectedMapPlace;

  // Preset Hubs for "Chọn vị trí bất kỳ"
  final List<Map<String, dynamic>> _presetLocations = [
    {'name': 'Chợ Bến Thành (Quận 1)', 'lat': 10.7725, 'lng': 106.6980, 'desc': 'Khu phố ẩm thực & di sản trăm năm Sài Gòn', 'culture': 'Trung tâm sôi động với chợ đêm ẩm thực, bánh mì, bún riêu và kiến trúc tháp đồng hồ trăm năm.'},
    {'name': 'Cơm Tấm Ba Ghiền (Phú Nhuận)', 'lat': 10.7938, 'lng': 106.6710, 'desc': 'Khu ẩm thực nướng than sườn bì chả nức tiếng', 'culture': 'Khu phố ẩm thực trứ danh Phú Nhuận với sườn nướng than khổng lồ và mỡ hành béo ngậy.'},
    {'name': 'Phở Lệ (Chợ Lớn Quận 5)', 'lat': 10.7554, 'lng': 106.6702, 'desc': 'Khu Chợ Lớn sầm uất với phở Nam Bộ & món Hoa', 'culture': 'Nét văn hóa ẩm thực giao thoa Việt - Hoa trăm năm tại vùng Chợ Lớn với bò viên và hủ tiếu.'},
    {'name': 'Hồ Hoàn Kiếm (Hà Nội)', 'lat': 21.0287, 'lng': 105.8523, 'desc': 'Trái tim di sản Tháp Rùa & 36 phố phường', 'culture': 'Không gian di sản nghìn năm Thăng Long với Tháp Rùa, cầu Thê Húc, phở Bát Đàn và cà phê trứng.'},
    {'name': 'Quảng Trường Ba Đình (Hà Nội)', 'lat': 21.0358, 'lng': 105.8335, 'desc': 'Khu di tích lịch sử Chùa Một Cột & Hoàng Thành', 'culture': 'Quần thể di tích lịch sử quốc gia đặc biệt với kiến trúc đài sen chùa Một Cột và Hoàng Thành.'},
  ];

  // Master Data: Comprehensive Sài Gòn & Hà Nội Heritage & Culinary Spots
  final List<Map<String, dynamic>> _masterPlaces = [
    // --- SÀI GÒN (TP. HỒ CHÍ MINH) ---
    {
      'id': 'saigon-1',
      'city': 'saigon',
      'type': 'heritage',
      'title': 'Chợ Bến Thành',
      'subtitle': 'Biểu tượng giao thương & văn hóa trăm năm Sài Gòn',
      'image': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7725,
      'lng': 106.6980,
      'year': 'Năm 1914 (110 năm)',
      'address': 'Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      'story': 'Chợ Bến Thành khánh thành năm 1914, sở hữu tháp đồng hồ 4 mặt cửa Nam trứ danh. Nơi đây là chứng nhân lịch sử đô thị Sài Gòn hoa lệ và là trung tâm mua sắm sầm uất.',
      'highlights': ['Tháp đồng hồ 3 tầng cửa Nam', 'Khung vòm mái ngói đất nung Pháp', 'Chợ đêm ẩm thực náo nhiệt'],
      'tip': 'Buổi sáng ghé ăn bún riêu, chè sương sa hạt lựu; buổi tối dạo chợ đêm lung linh ánh đèn.',
      'tags': ['Chợ cổ', 'Quận 1', 'Biểu tượng Sài Gòn', 'Mua sắm', 'Ẩm thực đêm'],
      'openHours': '06:00 - 22:00 hàng ngày',
      'price': 'Miễn phí tham quan',
    },
    {
      'id': 'saigon-2',
      'city': 'saigon',
      'type': 'heritage',
      'title': 'Dinh Độc Lập',
      'subtitle': 'Di tích quốc gia đặc biệt & kiệt tác kiến trúc hiện đại',
      'image': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7769,
      'lng': 106.6953,
      'year': 'Năm 1966',
      'address': '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP. Hồ Chí Minh',
      'story': 'Do kiến trúc sư Ngô Viết Thụ thiết kế kết hợp triết lý phương Đông và phong cách hiện đại. Nơi đây ghi dấu mốc lịch sử giải phóng miền Nam thống nhất đất nước ngày 30/4/1975.',
      'highlights': ['Mặt tiền rèm hoa đá hình gióng trúc', 'Phòng Khánh tiết tráng lệ', 'Hầm chỉ huy quân sự nguyên vẹn'],
      'tip': 'Nên dành ít nhất 1.5 giờ tham quan khuôn viên cây cổ thụ và hệ thống hầm ngầm.',
      'tags': ['Lịch sử 1975', 'Quận 1', 'Kiến trúc hiện đại', 'Công viên xanh'],
      'openHours': '08:00 - 16:30 hàng ngày',
      'price': '40.000đ - 65.000đ',
    },
    {
      'id': 'saigon-3',
      'city': 'saigon',
      'type': 'heritage',
      'title': 'Bưu điện Trung tâm Sài Gòn',
      'subtitle': 'Kiệt tác kiến trúc Gothic kết hợp Phục hưng Pháp',
      'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7798,
      'lng': 106.6999,
      'year': 'Năm 1891 (133 năm)',
      'address': 'Số 02 Công xã Paris, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      'story': 'Được xây dựng từ năm 1886 đến 1891 đối diện Nhà thờ Đức Bà. Mái vòm kim loại uốn cong mang dấu ấn kiến trúc công nghiệp châu Âu, bên trong còn lưu giữ 2 bản đồ cổ vẽ tay năm 1892.',
      'highlights': ['Mái vòm sắt uốn cong tinh xảo', 'Bản đồ Sài Gòn cổ 1892', 'Quầy bưu chính bằng gỗ lim'],
      'tip': 'Hãy viết một tấm bưu thiếp tay và đóng dấu mộc bưu cục Sài Gòn gửi tặng người thân.',
      'tags': ['Kiến trúc Pháp', 'Nhà thờ Đức Bà', 'Công xã Paris', 'Bưu thiếp'],
      'openHours': '07:30 - 18:00 hàng ngày',
      'price': 'Miễn phí tham quan',
    },
    {
      'id': 'saigon-food-1',
      'city': 'saigon',
      'type': 'food',
      'foodCategory': 'com_tam',
      'title': 'Cơm Tấm Ba Ghiền',
      'subtitle': 'Sườn cốt lết nướng than hoa khổng lồ phủ mỡ hành',
      'image': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7938,
      'lng': 106.6710,
      'price': '75.000đ - 110.000đ',
      'spice': 'Đậm đà chua ngọt mỡ hành',
      'address': '84 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP. Hồ Chí Minh',
      'story': 'Quán cơm tấm huyền thoại hơn 30 năm nức tiếng với miếng sườn cốt lết to bằng cái đĩa, ướp mật ong và nướng than hoa thơm lừng góc phố, ăn kèm hạt tấm dẻo, bì chả trứng và mắm kẹo.',
      'highlights': ['Sườn nướng than khổng lồ', 'Mỡ hành tóp mỡ béo ngậy', 'Nước mắm kẹo ớt tỏi'],
      'tip': 'Rưới mắm kẹo và mỡ hành lên bề mặt miếng sườn khi còn nóng hổi để hạt cơm thấm vị.',
      'tags': ['Cơm tấm', 'Sườn bì chả', 'Đặc sản Sài Gòn', 'Phú Nhuận', 'Mỡ hành'],
      'openHours': '07:00 - 21:00 hàng ngày',
    },
    {
      'id': 'saigon-food-2',
      'city': 'saigon',
      'type': 'food',
      'foodCategory': 'banh_mi',
      'title': 'Bánh Mì Huỳnh Hoa',
      'subtitle': 'Bánh mì pate bơ kẹp 5 tầng thịt nguội trứ danh',
      'image': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7709,
      'lng': 106.6926,
      'price': '58.000đ - 68.000đ',
      'spice': 'Cay nồng ớt hiểm',
      'address': '26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      'story': 'Được mệnh danh là ổ bánh mì đầy đặn và đắt khách nhất Sài Gòn. Lớp pate gan béo bùi gia truyền quệt dày, kẹp giò lụa, xá xíu, chả quế, giăm bông và dưa leo đồ chua giòn rụm.',
      'highlights': ['Pate gan béo mịn gia truyền', '5 lớp thịt nguội hảo hạng', 'Vỏ bánh mì nướng giòn tan'],
      'tip': 'Nên thưởng thức ngay khi vừa mua để cảm nhận độ giòn của vỏ bánh và độ ngậy của pate bơ.',
      'tags': ['Bánh mì', 'Huỳnh Hoa', 'Pate bơ', 'Quận 1', 'Ẩm thực đường phố'],
      'openHours': '11:00 - 23:00 hàng ngày',
    },
    {
      'id': 'saigon-food-3',
      'city': 'saigon',
      'type': 'food',
      'foodCategory': 'pho_bun',
      'title': 'Phở Lệ Sài Gòn',
      'subtitle': 'Phở bò Nam Bộ nước dùng béo ngọt thơm ngò gai tương đen',
      'image': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7554,
      'lng': 106.6702,
      'price': '75.000đ - 95.000đ',
      'spice': 'Đậm đà phong vị Nam Bộ',
      'address': '415 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh',
      'story': 'Hơn 50 năm phục vụ thực khách Sài Gòn - Chợ Lớn. Phở Lệ mang trọn vẹn nét đặc trưng của phở Nam Bộ với đĩa rau húng quế, ngò gai tươi mát, chén tương đen, tương đỏ và bò viên giòn sần sật.',
      'highlights': ['Nước dùng bò hầm ngọt thanh', 'Bò viên giòn dai nguyên chất', 'Rau thơm ngò gai tươi ngập tràn'],
      'tip': 'Pha chén tương đen kèm chút sa tế ớt để chấm thịt bò tái nạm gầu giòn.',
      'tags': ['Phở', 'Bò viên', 'Quận 5', 'Chợ Lớn', 'Phở Nam Bộ'],
      'openHours': '06:00 - 01:00 sáng hôm sau',
    },
    {
      'id': 'saigon-food-4',
      'city': 'saigon',
      'type': 'food',
      'foodCategory': 'pho_bun',
      'title': 'Hủ Tiếu Nam Vang Thành Đạt',
      'subtitle': 'Hủ tiếu khô trộn sốt tôm thịt băm tóp mỡ giòn rụm',
      'image': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
      'lat': 10.7678,
      'lng': 106.6905,
      'price': '55.000đ - 70.000đ',
      'spice': 'Chua ngọt tỏi phi thơm nức',
      'address': '34 Cô Bắc, Cầu Ông Lãnh, Quận 1, TP. Hồ Chí Minh',
      'story': 'Sự giao thoa ẩm thực tuyệt vời giữa phong vị Việt - Hoa - Khmer. Sợi hủ tiếu dai dai được trộn đều cùng sốt tương sệt, thịt bằm, tôm tươi, trứng cút và ngập tràn tóp mỡ tỏi phi vàng giòn.',
      'highlights': ['Hủ tiếu khô trộn sốt đặc trưng', 'Tóp mỡ tỏi phi giòn tan', 'Tô nước súp sườn ngọt tôm'],
      'tip': 'Hãy gọi tô hủ tiếu khô ăn kèm chén súp sườn cay nóng để cảm nhận vị dai ngọt trọn vẹn.',
      'tags': ['Hủ tiếu', 'Hủ tiếu khô', 'Tóp mỡ', 'Cô Bắc', 'Quận 1'],
      'openHours': '24/24 phục vụ cả ngày đêm',
    },

    // --- HÀ NỘI ---
    {
      'id': 'hanoi-1',
      'city': 'hanoi',
      'type': 'heritage',
      'title': 'Chùa Một Cột',
      'subtitle': 'Diên Hựu Tự - Đóa sen nghìn năm Thăng Long',
      'image': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      'lat': 21.0358,
      'lng': 105.8335,
      'year': 'Năm 1049 (Thời Lý)',
      'address': 'Phố Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
      'story': 'Chùa Một Cột được vua Lý Thái Tông khởi dựng năm 1049 sau giấc mơ thấy Phật Bà Quan Âm dắt lên tòa sen. Kiến trúc độc nhất vô nhị châu Á với đài sen lim dựng trên cột đá đơn giữa hồ Linh Chiểu.',
      'highlights': ['Cột đá đơn nguyên khối', 'Mái đao cong vút chạm rồng', 'Hồ sen Linh Chiểu thanh tịnh'],
      'tip': 'Nên ghé thăm sáng sớm để tận hưởng không gian thiền tịnh và hương sen thoang thoảng.',
      'tags': ['Chùa cổ', 'Thời Lý', 'Ba Đình', 'Di sản Thăng Long'],
      'openHours': '07:00 - 18:00 hàng ngày',
      'price': 'Miễn phí vé tham quan',
    },
    {
      'id': 'hanoi-2',
      'city': 'hanoi',
      'type': 'heritage',
      'title': 'Văn Miếu - Quốc Tử Giám',
      'subtitle': 'Trường đại học đầu tiên & biểu tượng hiếu học',
      'image': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
      'lat': 21.0294,
      'lng': 105.8360,
      'year': 'Năm 1070 & 1076',
      'address': '58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
      'story': 'Được xây dựng vào năm 1070 dưới thời vua Lý Thánh Tông. Đến năm 1076, Quốc Tử Giám được lập bên cạnh, đào tạo hàng ngàn danh nhân Đại Việt suốt hơn 7 thế kỷ với 82 tấm bia tiến sĩ vinh danh.',
      'highlights': ['Gác Khuê Văn Các bằng gỗ', '82 bia Tiến sĩ trên lưng rùa đá', 'Hồ Thiên Quang Tỉnh thanh khiết'],
      'tip': 'Hãy đi dọc vườn bia để chiêm ngưỡng hoa văn chạm khắc rồng mây tinh xảo thế kỷ 15-18.',
      'tags': ['Văn Miếu', 'Quốc Tử Giám', 'Khuê Văn Các', 'Bia tiến sĩ'],
      'openHours': '08:00 - 17:00 hàng ngày',
      'price': '30.000đ / người',
    },
    {
      'id': 'hanoi-3',
      'city': 'hanoi',
      'type': 'heritage',
      'title': 'Tháp Rùa - Hồ Hoàn Kiếm',
      'subtitle': 'Trái tim di sản và huyền tích gươm thần Thuận Thiên',
      'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      'lat': 21.0287,
      'lng': 105.8523,
      'year': 'Năm 1886',
      'address': 'Trung tâm quận Hoàn Kiếm, Hà Nội',
      'story': 'Gắn liền với truyền thuyết vua Lê Lợi trả gươm báu Thuận Thiên cho Rùa Vàng. Giữa lòng hồ xanh biếc quanh năm là Tháp Rùa cổ kính, cầu Thê Húc đỏ son dẫn vào Đền Ngọc Sơn uy nghiêm.',
      'highlights': ['Cầu Thê Húc đỏ son', 'Đài Nghiên và Tháp Bút', 'Mặt hồ lục thủy nghìn năm'],
      'tip': 'Thời điểm ngắm đẹp nhất là hoàng hôn khi ánh đèn vàng rực rỡ soi bóng xuống mặt hồ.',
      'tags': ['Hồ Gươm', 'Tháp Rùa', 'Hoàn Kiếm', 'Đền Ngọc Sơn'],
      'openHours': 'Công viên mở 24/24',
      'price': 'Miễn phí ngắm cảnh',
    },
    {
      'id': 'hanoi-food-1',
      'city': 'hanoi',
      'type': 'food',
      'foodCategory': 'pho_bun',
      'title': 'Phở Bò Gia Truyền Bát Đàn',
      'subtitle': 'Phở bò tái lăn nước dùng niêu hầm 14 tiếng',
      'image': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      'lat': 21.0343,
      'lng': 105.8475,
      'price': '55.000đ - 75.000đ',
      'spice': 'Cay nhẹ ấm nồng',
      'address': '49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội',
      'story': 'Quán phở Bát Đàn giữ trọn hương vị phở phố cổ suốt hơn 7 thập kỷ với nước dùng ninh hoàn toàn từ xương ống bò tươi cùng quế hồi thảo quả nướng cháy xém, không mì chính.',
      'highlights': ['Nước dùng trong veo ngọt tủy', 'Thịt bò tươi mềm ngọt', 'Quẩy vàng giòn rụm'],
      'tip': 'Nên đến trước 8h sáng để thưởng thức bát phở nóng hổi khi nước dùng đạt độ ngọt thanh nhất.',
      'tags': ['Phở Bát Đàn', 'Phở Hà Nội', 'Bò tái lăn', 'Phố cổ'],
      'openHours': '06:00 - 10:00 & 18:00 - 20:30',
    },
    {
      'id': 'hanoi-food-2',
      'city': 'hanoi',
      'type': 'food',
      'foodCategory': 'heritage',
      'title': 'Chả Cá Lã Vọng Phố Cổ',
      'subtitle': 'Cá lăng nướng than hoa om thì là chảo đồng',
      'image': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
      'lat': 21.0360,
      'lng': 105.8490,
      'price': '130.000đ - 180.000đ',
      'spice': 'Đậm đà mắm tôm',
      'address': '14 Chả Cá, Hàng Bồ, Hoàn Kiếm, Hà Nội',
      'story': 'Khởi nguồn năm 1871 bởi gia tộc họ Đoàn. Từng miếng cá lăng nướng vàng ươm rồi om nóng trên chảo gang với thì là và đầu hành hoa trắng giòn, chấm mắm tôm bông bọt.',
      'highlights': ['Cá lăng sông Hồng thơm ngậy', 'Mắm tôm chanh đánh sủi bọt', 'Thì là và hành hoa xào nóng'],
      'tip': 'Kẹp miếng cá kèm nhánh thì là, rắc lạc rang và chấm vào chén mắm tôm chanh đánh bông bọt.',
      'tags': ['Chả cá', 'Lã Vọng', 'Đặc sản kinh kỳ', 'Mắm tôm'],
      'openHours': '11:00 - 14:00 & 17:00 - 21:00',
    },
  ];

  @override
  void initState() {
    super.initState();
    _initSensors();
    _initTTS();
    _fetchLiveGPSLocation();
  }

  @override
  void dispose() {
    _magnetometerSub?.cancel();
    _accelerometerSub?.cancel();
    _flutterTts.stop();
    _searchController.dispose();
    super.dispose();
  }

  // --- HARDWARE SENSORS WITH DAMPED CIRCULAR FILTER ---
  void _initSensors() {
    try {
      _magnetometerSub = magnetometerEventStream().listen(
        (MagnetometerEvent event) {
          final heading = math.atan2(event.y, event.x) * (180 / math.pi);
          final rawBearing = (heading + 360) % 360;
          if (mounted) {
            double diff = (rawBearing - _compassBearing + 540) % 360 - 180;
            setState(() {
              _compassBearing = (_compassBearing + diff * 0.18 + 360) % 360;
              _hasHardwareCompass = true;
            });
          }
        },
        onError: (_) => _listenAccelerometerFallback(),
      );
    } catch (_) {
      _listenAccelerometerFallback();
    }
  }

  void _listenAccelerometerFallback() {
    try {
      _accelerometerSub = accelerometerEventStream().listen((AccelerometerEvent event) {
        final tilt = math.atan2(event.x, event.y) * (180 / math.pi);
        if (mounted && !_hasHardwareCompass) {
          double diff = ((tilt + 360) % 360 - _compassBearing + 540) % 360 - 180;
          setState(() {
            _compassBearing = (_compassBearing + diff * 0.15 + 360) % 360;
          });
        }
      });
    } catch (_) {}
  }

  // --- TTS SPEECH ---
  void _initTTS() async {
    try {
      await _flutterTts.setLanguage('vi-VN');
      await _flutterTts.setSpeechRate(0.9);
      _flutterTts.setCompletionHandler(() {
        if (mounted) {
          setState(() {
            _isPlayingTTS = false;
            _speakingId = null;
          });
        }
      });
    } catch (_) {}
  }

  // --- REAL DEVICE GPS LOCATION ---
  Future<void> _fetchLiveGPSLocation() async {
    setState(() => _isGpsLoading = true);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _setCustomPoint(10.7769, 106.6953, 'TP. Hồ Chí Minh (GPS chưa bật)', isGps: false);
        _showNotice('Vui lòng bật GPS trên máy. Đang chọn Sài Gòn làm tâm điểm.');
        setState(() => _isGpsLoading = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _setCustomPoint(10.7769, 106.6953, 'TP. Hồ Chí Minh (Quyền bị từ chối)', isGps: false);
          setState(() => _isGpsLoading = false);
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _setCustomPoint(10.7769, 106.6953, 'TP. Hồ Chí Minh (Quyền bị khóa)', isGps: false);
        setState(() => _isGpsLoading = false);
        return;
      }

      final lastPos = await Geolocator.getLastKnownPosition();
      if (lastPos != null && mounted) {
        _setRealGpsCoords(lastPos.latitude, lastPos.longitude, lastPos.accuracy);
      }

      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 8),
        ),
      );

      if (mounted) {
        _setRealGpsCoords(pos.latitude, pos.longitude, pos.accuracy);
        setState(() => _isGpsLoading = false);
        _showNotice('Đã định vị GPS thật chính xác: ${_activeLatitude.toStringAsFixed(4)}°B, ${_activeLongitude.toStringAsFixed(4)}°Đ (±${_gpsAccuracy.toStringAsFixed(1)}m)');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isGpsLoading = false);
        _setCustomPoint(10.7769, 106.6953, 'TP. Hồ Chí Minh (Sài Gòn)', isGps: false);
      }
    }
  }

  void _setRealGpsCoords(double lat, double lng, double accuracy) {
    setState(() {
      _realGpsLatitude = lat;
      _realGpsLongitude = lng;
      _activeLatitude = lat;
      _activeLongitude = lng;
      _gpsAccuracy = accuracy;
      _isRealGpsMode = true;
      if (lat < 14.0) {
        _activeLocationName = 'Vị trí của bạn (Sài Gòn)';
      } else if (lat > 18.0) {
        _activeLocationName = 'Vị trí của bạn (Hà Nội)';
      } else {
        _activeLocationName = 'Vị trí GPS thật của bạn';
      }
    });
  }

  void _setCustomPoint(double lat, double lng, String name, {bool isGps = false}) {
    setState(() {
      _activeLatitude = lat;
      _activeLongitude = lng;
      _activeLocationName = name;
      _isRealGpsMode = isGps;
    });
    _showNotice('Đã dời tâm điểm quét sang: $name');
  }

  void _showNotice(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: const TextStyle(fontSize: 12)),
        backgroundColor: const Color(0xFF1B4D3E),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _toggleTTS(String id, String title, String story) async {
    if (_isPlayingTTS && _speakingId == id) {
      await _flutterTts.stop();
      setState(() {
        _isPlayingTTS = false;
        _speakingId = null;
      });
    } else {
      await _flutterTts.stop();
      setState(() {
        _isPlayingTTS = true;
        _speakingId = id;
      });
      await _flutterTts.speak('$title. $story');
    }
  }

  // --- DYNAMIC DISTANCE, BEARING & WALKING TIME ESTIMATE ---
  List<Map<String, dynamic>> _getCalculatedPlaces() {
    return _masterPlaces.map((place) {
      final double pLat = (place['lat'] as num).toDouble();
      final double pLng = (place['lng'] as num).toDouble();

      final double distance = Geolocator.distanceBetween(_activeLatitude, _activeLongitude, pLat, pLng);

      double bearing = Geolocator.bearingBetween(_activeLatitude, _activeLongitude, pLat, pLng);
      if (bearing < 0) bearing += 360;

      // Smart ETA calculation:
      // Walking speed: ~80 m/min (~4.8 km/h)
      // Motorbike speed: ~350 m/min (~21 km/h in city)
      final int walkMinutes = (distance / 80).ceil();
      final int bikeMinutes = (distance / 350).ceil();

      return {
        ...place,
        'calculatedDistance': distance,
        'calculatedBearing': bearing,
        'walkMinutes': walkMinutes,
        'bikeMinutes': bikeMinutes,
      };
    }).toList();
  }

  String _formatDistance(double meters) {
    if (meters < 1000) {
      return '${meters.round()}m';
    } else if (meters < 100000) {
      return '${(meters / 1000).toStringAsFixed(1)} km';
    } else {
      return '${(meters / 1000).round()} km';
    }
  }

  String _formatETA(int walkMin) {
    if (walkMin <= 1) return '1 phút đi bộ';
    if (walkMin < 60) return '$walkMin phút đi bộ';
    final int hours = walkMin ~/ 60;
    final int mins = walkMin % 60;
    return '$hours giờ $mins phút đi bộ';
  }

  String _getDirectionName(double deg) {
    const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    final idx = ((deg / 45).round()) % 8;
    return dirs[idx];
  }

  List<Map<String, dynamic>> _getFilteredPlaces() {
    var list = _getCalculatedPlaces();

    if (_selectedFoodCategory == 'com_tam') {
      list = list.where((p) => p['foodCategory'] == 'com_tam').toList();
    } else if (_selectedFoodCategory == 'banh_mi') {
      list = list.where((p) => p['foodCategory'] == 'banh_mi').toList();
    } else if (_selectedFoodCategory == 'pho_bun') {
      list = list.where((p) => p['foodCategory'] == 'pho_bun').toList();
    } else if (_selectedFoodCategory == 'heritage') {
      list = list.where((p) => p['type'] == 'heritage').toList();
    }

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase().trim();
      list = list.where((p) {
        final title = (p['title'] as String).toLowerCase();
        final subtitle = (p['subtitle'] as String).toLowerCase();
        final address = (p['address'] as String).toLowerCase();
        final tags = (p['tags'] as List<dynamic>?)?.join(' ').toLowerCase() ?? '';
        final story = (p['story'] as String?)?.toLowerCase() ?? '';

        return title.contains(q) || subtitle.contains(q) || address.contains(q) || tags.contains(q) || story.contains(q);
      }).toList();
    }

    list.sort((a, b) => (a['calculatedDistance'] as num).compareTo(b['calculatedDistance'] as num));
    return list;
  }

  List<Map<String, dynamic>> _getPlacesWithinRadius() {
    final list = _getCalculatedPlaces();
    return list.where((p) => (p['calculatedDistance'] as num).toDouble() <= _analysisRadiusMeters).toList();
  }

  String _getAreaCultureSummary() {
    final preset = _presetLocations.firstWhere(
      (h) => _activeLocationName.contains(h['name']),
      orElse: () => {'culture': 'Khu vực có sự phân bổ dày đặc của các địa danh văn hóa di sản và ẩm thực đường phố đặc trưng.'},
    );
    return preset['culture'] as String;
  }

  void _navigateToAR({String? initialTargetId}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ARViewportScreen(
          initialBearing: _compassBearing,
          places: _getCalculatedPlaces(),
          initialTargetId: initialTargetId,
          onToggleTTS: _toggleTTS,
          isPlayingTTS: _isPlayingTTS,
          speakingId: _speakingId,
          onUpdateBearing: (b) => setState(() => _compassBearing = b),
        ),
      ),
    );
  }

  void _showLocationPickerModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 16),
            const Text('Tùy Chọn Vị Trí Tâm Điểm Định Vị', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF151D1A))),
            const SizedBox(height: 6),
            const Text('Chọn vị trí GPS thật của máy hoặc chọn các tâm điểm văn hóa để quét phân tích khu vực.', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const Divider(height: 24),

            ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(shape: BoxShape.circle, color: _isRealGpsMode ? const Color(0xFF1B4D3E) : Colors.grey[200]),
                child: Icon(Icons.my_location, color: _isRealGpsMode ? Colors.white : Colors.black87),
              ),
              title: const Text('Vị trí GPS Hiện Tại (Thật)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: Text('Tọa độ: ${_realGpsLatitude.toStringAsFixed(4)}°B, ${_realGpsLongitude.toStringAsFixed(4)}°Đ (±${_gpsAccuracy.toStringAsFixed(1)}m)', style: const TextStyle(fontSize: 11)),
              trailing: _isRealGpsMode ? const Icon(Icons.check_circle, color: Color(0xFF1B4D3E)) : null,
              onTap: () {
                Navigator.pop(context);
                _fetchLiveGPSLocation();
              },
            ),

            const Divider(height: 16),
            const Text('Hoặc chọn tâm điểm văn hóa để quét xung quanh:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1B4D3E))),
            const SizedBox(height: 8),

            ..._presetLocations.map((hub) {
              final isCurrent = !_isRealGpsMode && _activeLocationName.contains(hub['name']);
              return ListTile(
                dense: true,
                leading: const Icon(Icons.location_city, color: Color(0xFFD96B27)),
                title: Text(hub['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text(hub['desc'], style: const TextStyle(fontSize: 11, color: Colors.grey)),
                trailing: isCurrent ? const Icon(Icons.check_circle, color: Color(0xFFD96B27)) : null,
                onTap: () {
                  Navigator.pop(context);
                  _setCustomPoint((hub['lat'] as num).toDouble(), (hub['lng'] as num).toDouble(), hub['name']);
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(),
            Expanded(child: _buildBody()),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        height: 64,
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: [
          const NavigationDestination(icon: Icon(Icons.explore_outlined), selectedIcon: Icon(Icons.explore), label: 'Khám phá'),
          const NavigationDestination(icon: Icon(Icons.camera_alt_outlined), selectedIcon: Icon(Icons.camera_alt), label: 'Ống ngắm AR'),
          const NavigationDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map), label: 'Bản đồ Radar'),
          NavigationDestination(
            icon: Badge(
              label: Text('${_bookmarkedIds.length}'),
              isLabelVisible: _bookmarkedIds.isNotEmpty,
              child: const Icon(Icons.bookmark_outline),
            ),
            selectedIcon: const Icon(Icons.bookmark),
            label: 'Đã lưu',
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE2EAE5), width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: GestureDetector(
              onTap: _showLocationPickerModal,
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: _isRealGpsMode ? const Color(0xFF1B4D3E) : const Color(0xFFD96B27),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(_isRealGpsMode ? Icons.my_location : Icons.edit_location_alt, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                _activeLocationName,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF151D1A)),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const Icon(Icons.arrow_drop_down, size: 18, color: Colors.grey),
                          ],
                        ),
                        Text(
                          '${_activeLatitude.toStringAsFixed(3)}°B, ${_activeLongitude.toStringAsFixed(3)}°Đ · ${_isRealGpsMode ? "GPS thật (±${_gpsAccuracy.toStringAsFixed(1)}m)" : "Tùy chọn"}',
                          style: const TextStyle(fontSize: 10, color: Color(0xFF707974)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.camera_alt, color: Color(0xFFD96B27)),
                tooltip: 'Mở Ống Ngắm Camera AR Thông Minh',
                onPressed: () => _navigateToAR(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return _buildExploreTab();
      case 1:
        return _buildSensorARTab();
      case 2:
        return _buildSmartMapRadarTab();
      case 3:
        return _buildSavedTab();
      default:
        return _buildExploreTab();
    }
  }

  // ==========================================================================
  // TAB 1: KHÁM PHÁ & BỘ LỌC THÔNG MINH
  // ==========================================================================
  Widget _buildExploreTab() {
    final filteredPlaces = _getFilteredPlaces();
    final withinRadius = _getPlacesWithinRadius();

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Bar
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Tìm món ăn (cơm tấm, bánh mì, phở...), di tích...',
                hintStyle: TextStyle(fontSize: 13, color: Colors.grey[500]),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF1B4D3E)),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),

          const SizedBox(height: 10),

          // Food Categories
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: [
                _buildCategoryFilterChip('all', 'Tất cả món'),
                const SizedBox(width: 8),
                _buildCategoryFilterChip('com_tam', '🍚 Cơm Tấm'),
                const SizedBox(width: 8),
                _buildCategoryFilterChip('banh_mi', '🥖 Bánh Mì'),
                const SizedBox(width: 8),
                _buildCategoryFilterChip('pho_bun', '🍜 Phở & Hủ Tiếu'),
                const SizedBox(width: 8),
                _buildCategoryFilterChip('heritage', '🏛️ Di Sản Lịch Sử'),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Area Radius Analysis Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFEDF6F1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFC9DBD0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.radar, color: Color(0xFF1B4D3E), size: 18),
                        const SizedBox(width: 6),
                        const Text('Phân Tích Bán Kính Khu Vực', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1B4D3E))),
                      ],
                    ),
                    Text('${withinRadius.length} điểm trong bán kính', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFD96B27))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildRadiusChip(500, '500m'),
                    const SizedBox(width: 6),
                    _buildRadiusChip(1000, '1 km'),
                    const SizedBox(width: 6),
                    _buildRadiusChip(3000, '3 km'),
                    const SizedBox(width: 6),
                    _buildRadiusChip(5000, '5 km'),
                    const SizedBox(width: 6),
                    _buildRadiusChip(100000, 'Toàn quốc'),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  _getAreaCultureSummary(),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF404945), height: 1.4),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Places list
          if (filteredPlaces.isEmpty) ...[
            Padding(
              padding: const EdgeInsets.only(top: 60),
              child: Center(
                child: Column(
                  children: [
                    Icon(Icons.search_off, size: 54, color: Colors.grey[400]),
                    const SizedBox(height: 10),
                    Text('Không tìm thấy kết quả phù hợp với "$_searchQuery"', style: const TextStyle(fontSize: 13, color: Colors.grey)),
                  ],
                ),
              ),
            ),
          ] else ...[
            ...filteredPlaces.map((place) => _buildPlaceCard(place)),
          ],
        ],
      ),
    );
  }

  Widget _buildRadiusChip(double meters, String label) {
    final isSelected = _analysisRadiusMeters == meters;
    return GestureDetector(
      onTap: () => setState(() => _analysisRadiusMeters = meters),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1B4D3E) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isSelected ? const Color(0xFF1B4D3E) : const Color(0xFFC9DBD0)),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF404945)),
        ),
      ),
    );
  }

  Widget _buildCategoryFilterChip(String catKey, String label) {
    final isSelected = _selectedFoodCategory == catKey;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedFoodCategory = catKey),
      selectedColor: const Color(0xFFD96B27),
      backgroundColor: Colors.white,
      labelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF404945)),
    );
  }

  Widget _buildPlaceCard(Map<String, dynamic> item) {
    final isFood = item['type'] == 'food';
    final isSaved = _bookmarkedIds.contains(item['id']);
    final isSpeaking = _isPlayingTTS && _speakingId == item['id'];
    final double dist = (item['calculatedDistance'] as num).toDouble();
    final double bearing = (item['calculatedBearing'] as num).toDouble();
    final int walkMin = item['walkMinutes'] as int;
    final bool isInsideRadius = dist <= _analysisRadiusMeters;

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: isInsideRadius ? BorderSide(color: const Color(0xFF1B4D3E).withOpacity(0.35), width: 1.5) : BorderSide.none,
      ),
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      color: Colors.white,
      child: InkWell(
        onTap: () => _openDetailSheet(item),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Image.network(
                  item['image'],
                  height: 155,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 155,
                    color: const Color(0xFFE2EAE5),
                    child: Center(
                      child: Icon(isFood ? Icons.restaurant : Icons.account_balance, size: 40, color: const Color(0xFF76A286)),
                    ),
                  ),
                ),
                // Real Distance & Compass Bearing Pill with Walking ETA
                Positioned(
                  top: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.directions_walk, size: 14, color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E)),
                        const SizedBox(width: 4),
                        Text(
                          '${_formatDistance(dist)} · ${_formatETA(walkMin)} · Hướng ${bearing.toStringAsFixed(0)}°',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Bookmark Icon
                Positioned(
                  top: 6,
                  right: 6,
                  child: CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.95),
                    radius: 18,
                    child: IconButton(
                      icon: Icon(isSaved ? Icons.bookmark : Icons.bookmark_border, size: 18, color: const Color(0xFF1B4D3E)),
                      onPressed: () {
                        setState(() {
                          if (isSaved) {
                            _bookmarkedIds.remove(item['id']);
                          } else {
                            _bookmarkedIds.add(item['id']);
                          }
                        });
                      },
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item['title'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF151D1A))),
                  const SizedBox(height: 3),
                  Text(item['subtitle'], style: const TextStyle(fontSize: 12, color: Color(0xFF707974)), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Text(item['address'], style: const TextStyle(fontSize: 11, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      OutlinedButton.icon(
                        onPressed: () => _navigateToAR(initialTargetId: item['id']),
                        icon: const Icon(Icons.camera_alt, size: 14),
                        label: const Text('Ống Ngắm AR', style: TextStyle(fontSize: 11)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF1B4D3E),
                          side: const BorderSide(color: Color(0xFF1B4D3E)),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () => _toggleTTS(item['id'], item['title'], item['story']),
                        icon: Icon(isSpeaking ? Icons.pause_circle : Icons.volume_up, size: 16, color: const Color(0xFFD96B27)),
                        label: Text(isSpeaking ? 'Đang đọc' : 'Nghe tour', style: const TextStyle(fontSize: 12, color: Color(0xFFD96B27), fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================================
  // TAB 2: CẢM BIẾN & THÔNG SỐ KHÔNG GIAN
  // ==========================================================================
  Widget _buildSensorARTab() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Trung Tâm Cảm Biến Không Gian & Ống Ngắm Camera', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Hệ thống quang học AR kết hợp la bàn từ trường và camera thật.', style: TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 16),

          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10)],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Góc La Bàn Hiện Tại', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text('${_compassBearing.toStringAsFixed(1)}° (${_getDirectionName(_compassBearing)})', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1B4D3E))),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _hasHardwareCompass ? const Color(0xFFE8F5E9) : const Color(0xFFFFF3E0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _hasHardwareCompass ? 'La bàn phần cứng: BẬT' : 'Gia tốc mô phỏng',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _hasHardwareCompass ? Colors.green[800] : Colors.orange[800]),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: 170,
                  height: 170,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFF3FBF6),
                          border: Border.all(color: const Color(0xFFC9DBD0), width: 2),
                        ),
                      ),
                      Transform.rotate(
                        angle: -_compassBearing * (math.pi / 180),
                        child: CustomPaint(
                          size: const Size(160, 160),
                          painter: CompassDialPainter(),
                        ),
                      ),
                      const CircleAvatar(radius: 6, backgroundColor: Color(0xFF1B4D3E)),
                      Positioned(
                        top: 4,
                        child: Container(width: 3, height: 12, color: const Color(0xFFD96B27)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: () => _navigateToAR(),
                  icon: const Icon(Icons.camera_alt, size: 20),
                  label: const Text('Bật Ống Ngắm Camera AR Thông Minh', style: TextStyle(fontSize: 14)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1B4D3E),
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================================================
  // TAB 3: BẢN ĐỒ RADAR THÔNG MINH (DYNAMIC ROUTE BEAM & AREA INTELLIGENCE)
  // ==========================================================================
  Widget _buildSmartMapRadarTab() {
    final places = _getCalculatedPlaces();
    final withinRadius = _getPlacesWithinRadius();

    return Column(
      children: [
        // Smart Map Controls Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          color: Colors.white,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Tâm điểm: $_activeLocationName', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF151D1A)), maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text('Quét bán kính ${_formatDistance(_analysisRadiusMeters)} · Phát hiện ${withinRadius.length} điểm xung quanh', style: const TextStyle(fontSize: 10, color: Color(0xFFD96B27), fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      OutlinedButton.icon(
                        onPressed: _showLocationPickerModal,
                        icon: const Icon(Icons.edit_location, size: 14),
                        label: const Text('Đổi vị trí', style: TextStyle(fontSize: 11)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF1B4D3E),
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        ),
                      ),
                      const SizedBox(width: 6),
                      ElevatedButton(
                        onPressed: _fetchLiveGPSLocation,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1B4D3E),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        ),
                        child: const Text('GPS thật', style: TextStyle(fontSize: 11)),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 6),
              // Radius Selector on Map
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Bán kính:', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  const SizedBox(width: 6),
                  _buildMapRadiusChip(500, '500m'),
                  const SizedBox(width: 4),
                  _buildMapRadiusChip(1000, '1 km'),
                  const SizedBox(width: 4),
                  _buildMapRadiusChip(3000, '3 km'),
                  const SizedBox(width: 4),
                  _buildMapRadiusChip(5000, '5 km'),
                ],
              ),
            ],
          ),
        ),

        // Interactive Visual Map Canvas with Dynamic Walking Route Beam
        Expanded(
          child: Container(
            color: const Color(0xFFE5EFE9),
            child: Stack(
              children: [
                InteractiveViewer(
                  boundaryMargin: const EdgeInsets.all(300),
                  minScale: 0.5,
                  maxScale: 3.0,
                  child: Center(
                    child: SizedBox(
                      width: 500,
                      height: 500,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Radar grid circles with radius labels
                          CustomPaint(
                            size: const Size(500, 500),
                            painter: VisualMapCanvasPainter(userBearing: _compassBearing),
                          ),

                          // Dynamic Walking Route Beam drawn to Selected Place
                          if (_selectedMapPlace != null)
                            CustomPaint(
                              size: const Size(500, 500),
                              painter: MapRouteBeamPainter(
                                selectedBearing: (_selectedMapPlace!['calculatedBearing'] as num).toDouble(),
                                selectedDistance: (_selectedMapPlace!['calculatedDistance'] as num).toDouble(),
                              ),
                            ),

                          // Radar Scan Sweep Cone
                          Transform.rotate(
                            angle: _compassBearing * (math.pi / 180),
                            child: Container(
                              width: 320,
                              height: 320,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: SweepGradient(
                                  startAngle: 0.0,
                                  endAngle: math.pi / 3,
                                  colors: [
                                    const Color(0xFF76A286).withOpacity(0.35),
                                    Colors.transparent,
                                  ],
                                ),
                              ),
                            ),
                          ),

                          // Center Location Marker
                          Container(
                            width: 26,
                            height: 26,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _isRealGpsMode ? const Color(0xFF1B4D3E) : const Color(0xFFD96B27),
                              border: Border.all(color: Colors.white, width: 3),
                              boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 6)],
                            ),
                            child: Center(
                              child: Icon(_isRealGpsMode ? Icons.person : Icons.gps_fixed, color: Colors.white, size: 14),
                            ),
                          ),

                          // Places Pins positioned relative to active location
                          ...places.map((p) {
                            final double b = (p['calculatedBearing'] as num).toDouble();
                            final double dist = (p['calculatedDistance'] as num).toDouble();
                            final double radiusPx = (dist / 15.0).clamp(40.0, 220.0);
                            final double rad = (b - 90) * (math.pi / 180);

                            final double posX = 250 + math.cos(rad) * radiusPx;
                            final double posY = 250 + math.sin(rad) * radiusPx;
                            final bool isFood = p['type'] == 'food';
                            final bool isSelected = _selectedMapPlace?['id'] == p['id'];
                            final bool isInside = dist <= _analysisRadiusMeters;

                            return Positioned(
                              left: posX - 18,
                              top: posY - 18,
                              child: GestureDetector(
                                onTap: () {
                                  setState(() => _selectedMapPlace = p);
                                },
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  width: isSelected ? 42 : (isInside ? 36 : 28),
                                  height: isSelected ? 42 : (isInside ? 36 : 28),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? const Color(0xFFD96B27)
                                        : (isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E)).withOpacity(isInside ? 1.0 : 0.5),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: isSelected ? 2.5 : 1.5),
                                    boxShadow: const [BoxShadow(color: Colors.black38, blurRadius: 6)],
                                  ),
                                  child: Icon(
                                    isFood ? Icons.restaurant : Icons.account_balance,
                                    color: Colors.white,
                                    size: isSelected ? 20 : (isInside ? 16 : 12),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ),
                ),

                // Selected Place Bottom Card Preview with Walking Route Intelligence
                if (_selectedMapPlace != null)
                  Positioned(
                    bottom: 14,
                    left: 14,
                    right: 14,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 10)],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Image.network(
                                  _selectedMapPlace!['image'],
                                  width: 55,
                                  height: 55,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(_selectedMapPlace!['title'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${_formatDistance((_selectedMapPlace!['calculatedDistance'] as num).toDouble())} · ${_formatETA(_selectedMapPlace!['walkMinutes'] as int)} · Hướng ${_selectedMapPlace!['calculatedBearing'].toStringAsFixed(0)}°',
                                      style: const TextStyle(fontSize: 11, color: Color(0xFFD96B27), fontWeight: FontWeight.bold),
                                    ),
                                    Text(_selectedMapPlace!['address'] ?? '', style: const TextStyle(fontSize: 10, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                                  ],
                                ),
                              ),
                              ElevatedButton.icon(
                                onPressed: () => _navigateToAR(initialTargetId: _selectedMapPlace!['id']),
                                icon: const Icon(Icons.camera_alt, size: 14),
                                label: const Text('Ống Ngắm AR', style: TextStyle(fontSize: 11)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF1B4D3E),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMapRadiusChip(double meters, String label) {
    final isSelected = _analysisRadiusMeters == meters;
    return GestureDetector(
      onTap: () => setState(() => _analysisRadiusMeters = meters),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1B4D3E) : Colors.grey[200],
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : Colors.black87),
        ),
      ),
    );
  }

  // ==========================================================================
  // TAB 4: ĐÃ LƯU
  // ==========================================================================
  Widget _buildSavedTab() {
    final places = _getCalculatedPlaces();
    final savedItems = places.where((i) => _bookmarkedIds.contains(i['id'])).toList();

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Danh Mục Đã Lưu (${_bookmarkedIds.length})', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),
          if (savedItems.isEmpty) ...[
            const Center(
              child: Padding(
                padding: EdgeInsets.only(top: 80),
                child: Text('Chưa có địa điểm nào được lưu. Bấm icon bookmark để lưu nhé!', style: TextStyle(color: Colors.grey)),
              ),
            ),
          ] else ...[
            ...savedItems.map((item) => _buildPlaceCard(item)),
          ],
        ],
      ),
    );
  }

  void _openDetailSheet(Map<String, dynamic> item) {
    final isFood = item['type'] == 'food';
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 16),
            Text(item['title'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(item['subtitle'], style: const TextStyle(fontSize: 13, color: Colors.grey)),
            const Divider(height: 24),
            Text(isFood ? 'Giai thoại hương vị:' : 'Lịch sử & kiến trúc:', style: TextStyle(fontWeight: FontWeight.bold, color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E))),
            const SizedBox(height: 6),
            Text(item['story'] ?? '', style: const TextStyle(fontSize: 13, height: 1.5)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: const Color(0xFFFFF8F2), borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFFFFDBCB))),
              child: Text(isFood ? 'Mẹo thưởng thức: ${item['tip']}' : 'Mẹo tham quan: ${item['tip']}', style: const TextStyle(fontSize: 11, color: Color(0xFF521F00))),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _toggleTTS(item['id'], item['title'], item['story'] ?? '');
                    },
                    icon: const Icon(Icons.volume_up),
                    label: const Text('Phát thuyết minh tiếng Việt'),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1B4D3E), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 12)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// DEDICATED FULL-SCREEN SMART AR VIEWPORT WITH REAL CAMERA, AI OPTICAL LOCK & HUD
// ============================================================================

class ARViewportScreen extends StatefulWidget {
  final double initialBearing;
  final List<Map<String, dynamic>> places;
  final String? initialTargetId;
  final Function(String id, String title, String story) onToggleTTS;
  final bool isPlayingTTS;
  final String? speakingId;
  final Function(double) onUpdateBearing;

  const ARViewportScreen({
    super.key,
    required this.initialBearing,
    required this.places,
    this.initialTargetId,
    required this.onToggleTTS,
    required this.isPlayingTTS,
    required this.speakingId,
    required this.onUpdateBearing,
  });

  @override
  State<ARViewportScreen> createState() => _ARViewportScreenState();
}

class _ARViewportScreenState extends State<ARViewportScreen> {
  CameraController? _cameraController;
  bool _isCameraReady = false;
  bool _cameraPermissionFailed = false;

  late double _bearing;
  double _targetBearing = 0.0;
  double _pitch = 0.0;
  double _targetPitch = 0.0;

  bool _useLiveSensor = true;
  double _zoomLevel = 1.0;
  bool _isFlashOn = false;
  Map<String, dynamic>? _selectedTarget;

  // In-HUD Category Filter Pills inside AR
  String _arCategoryFilter = 'all'; // 'all', 'food', 'heritage'

  // In-HUD Search in AR Viewfinder
  bool _isSearchOpen = false;
  final TextEditingController _arSearchController = TextEditingController();
  String _arSearchQuery = '';

  // Sensor Subscriptions & 60 FPS Animation Ticker
  StreamSubscription<MagnetometerEvent>? _arMagnetometerSub;
  StreamSubscription<AccelerometerEvent>? _arAccelerometerSub;
  Timer? _renderLoopTimer;
  bool _hasMagnetometer = false;

  @override
  void initState() {
    super.initState();
    _bearing = widget.initialBearing;
    _targetBearing = widget.initialBearing;

    if (widget.initialTargetId != null) {
      _selectedTarget = widget.places.firstWhere(
        (p) => p['id'] == widget.initialTargetId,
        orElse: () => widget.places.first,
      );
    }

    _initHardwareCamera();
    _initArSensors();
    _startSmoothRenderLoop();
  }

  @override
  void dispose() {
    _renderLoopTimer?.cancel();
    _arMagnetometerSub?.cancel();
    _arAccelerometerSub?.cancel();
    _cameraController?.dispose();
    _arSearchController.dispose();
    super.dispose();
  }

  Future<void> _initHardwareCamera() async {
    if (_availableCameras.isEmpty) {
      try {
        _availableCameras = await availableCameras();
      } catch (e) {
        debugPrint('Error fetching cameras: $e');
      }
    }

    if (_availableCameras.isEmpty) {
      if (mounted) setState(() => _cameraPermissionFailed = true);
      return;
    }

    final backCamera = _availableCameras.firstWhere(
      (c) => c.lensDirection == CameraLensDirection.back,
      orElse: () => _availableCameras.first,
    );

    try {
      _cameraController = CameraController(
        backCamera,
        ResolutionPreset.high,
        enableAudio: false,
      );
      await _cameraController!.initialize();
      if (mounted) {
        setState(() {
          _isCameraReady = true;
        });
      }
    } catch (e) {
      debugPrint('Camera init exception: $e');
      if (mounted) {
        setState(() => _cameraPermissionFailed = true);
      }
    }
  }

  void _startSmoothRenderLoop() {
    _renderLoopTimer = Timer.periodic(const Duration(milliseconds: 16), (_) {
      if (!mounted) return;

      double diff = (_targetBearing - _bearing + 540) % 360 - 180;
      double pitchDiff = _targetPitch - _pitch;

      if (diff.abs() > 0.05 || pitchDiff.abs() > 0.05) {
        setState(() {
          _bearing = (_bearing + diff * 0.18 + 360) % 360;
          _pitch = _pitch + pitchDiff * 0.15;
          widget.onUpdateBearing(_bearing);
        });
      }
    });
  }

  void _initArSensors() {
    try {
      _arMagnetometerSub = magnetometerEventStream().listen(
        (MagnetometerEvent event) {
          if (!_useLiveSensor) return;
          final heading = math.atan2(event.y, event.x) * (180 / math.pi);
          _targetBearing = (heading + 360) % 360;
          _hasMagnetometer = true;
        },
        onError: (_) => _fallbackToAccelerometer(),
      );
    } catch (_) {
      _fallbackToAccelerometer();
    }

    try {
      _arAccelerometerSub = accelerometerEventStream().listen((AccelerometerEvent event) {
        if (!_useLiveSensor) return;
        final pitchAngle = math.atan2(event.z, math.sqrt(event.x * event.x + event.y * event.y)) * (180 / math.pi);
        _targetPitch = pitchAngle;
      });
    } catch (_) {}
  }

  void _fallbackToAccelerometer() {
    try {
      _arAccelerometerSub = accelerometerEventStream().listen((AccelerometerEvent event) {
        if (!_useLiveSensor || _hasMagnetometer) return;
        final tilt = math.atan2(event.x, event.y) * (180 / math.pi);
        _targetBearing = (tilt + 360) % 360;
      });
    } catch (_) {}
  }

  String _getDirectionName(double deg) {
    const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    final idx = ((deg / 45).round()) % 8;
    return dirs[idx];
  }

  String _formatDistance(double meters) {
    if (meters < 1000) {
      return '${meters.round()}m';
    } else {
      return '${(meters / 1000).toStringAsFixed(1)} km';
    }
  }

  List<Map<String, dynamic>> _getArFilteredPlaces() {
    var list = widget.places;

    if (_arCategoryFilter == 'food') {
      list = list.where((p) => p['type'] == 'food').toList();
    } else if (_arCategoryFilter == 'heritage') {
      list = list.where((p) => p['type'] == 'heritage').toList();
    }

    if (_arSearchQuery.trim().isNotEmpty) {
      final q = _arSearchQuery.toLowerCase().trim();
      list = list.where((p) {
        final title = (p['title'] as String).toLowerCase();
        final tags = (p['tags'] as List<dynamic>?)?.join(' ').toLowerCase() ?? '';
        return title.contains(q) || tags.contains(q);
      }).toList();
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    const double fov = 70.0;
    final arPlaces = _getArFilteredPlaces();

    // AI Optical Lock Detection: Target aligns with reticle (< 12 degrees)
    Map<String, dynamic>? lockedPlace;
    for (final p in arPlaces) {
      final double pb = (p['calculatedBearing'] as num).toDouble();
      double diff = (pb - _bearing + 540) % 360 - 180;
      if (diff.abs() < 12) {
        lockedPlace = p;
        break;
      }
    }

    // Directional Guide Arrow for Selected Target if off-screen
    double? guideArrowAngle;
    if (_selectedTarget != null) {
      final double tb = (_selectedTarget!['calculatedBearing'] as num).toDouble();
      double diff = (tb - _bearing + 540) % 360 - 180;
      if (diff.abs() >= (fov / 2)) {
        guideArrowAngle = diff;
      }
    }

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            // 1. LIVE HARDWARE CAMERA STREAM OR FALLBACK
            _isCameraReady && _cameraController != null && _cameraController!.value.isInitialized
                ? SizedBox.expand(
                    child: FittedBox(
                      fit: BoxFit.cover,
                      child: SizedBox(
                        width: _cameraController!.value.previewSize?.height ?? screenSize.width,
                        height: _cameraController!.value.previewSize?.width ?? screenSize.height,
                        child: CameraPreview(_cameraController!),
                      ),
                    ),
                  )
                : Stack(
                    fit: StackFit.expand,
                    children: [
                      Transform.scale(
                        scale: _zoomLevel,
                        child: Transform.translate(
                          offset: Offset(
                            -((_bearing / 360) * screenSize.width * 2) % screenSize.width,
                            (_pitch * 1.5).clamp(-80.0, 80.0),
                          ),
                          child: Image.network(
                            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80',
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(color: const Color(0xFF101C17)),
                          ),
                        ),
                      ),
                      if (_cameraPermissionFailed)
                        Positioned(
                          top: 80,
                          left: 20,
                          right: 20,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: Colors.redAccent.withOpacity(0.85), borderRadius: BorderRadius.circular(10)),
                            child: const Text('Đang dùng chế độ mô phỏng (Camera chưa cấp quyền trong Cài đặt)', style: TextStyle(color: Colors.white, fontSize: 11), textAlign: TextAlign.center),
                          ),
                        ),
                    ],
                  ),

            // 2. ARTIFICIAL HORIZON PITCH LADDER HUD (AEROSPACE/MILITARY LEVELER)
            Positioned.fill(
              child: CustomPaint(
                painter: ArtificialHorizonPainter(pitch: _pitch),
              ),
            ),

            // AR Camera Grid Lines
            CustomPaint(
              size: Size.infinite,
              painter: ARGridPainter(),
            ),

            // 3. AI OPTICAL LOCK-ON RETICLE WITH HOLOGRAPHIC PULSE
            Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: lockedPlace != null ? 180 : 130,
                height: lockedPlace != null ? 180 : 130,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: lockedPlace != null ? const Color(0xFFD96B27) : Colors.white.withOpacity(0.4),
                    width: lockedPlace != null ? 2.5 : 1.2,
                  ),
                ),
                child: Center(
                  child: Container(
                    width: lockedPlace != null ? 12 : 6,
                    height: lockedPlace != null ? 12 : 6,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: lockedPlace != null ? const Color(0xFFD96B27) : Colors.white70,
                    ),
                  ),
                ),
              ),
            ),

            // 4. SMART OPTICAL HUD OVERLAY WHEN LOCKED
            if (lockedPlace != null)
              Positioned(
                top: screenSize.height * 0.36,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD96B27),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 8)],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.gps_fixed, color: Colors.white, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          'ĐÃ KHÓA: ${lockedPlace['title'].toUpperCase()}',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(8)),
                          child: Text(
                            '${lockedPlace['walkMinutes']}p đi bộ',
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

            // 5. DEPTH-AWARE 3D SPATIAL AR FLOATING TAGS (STAGGERED DEPTH SCALING)
            ...arPlaces.map((place) {
              final double placeBearing = (place['calculatedBearing'] as num).toDouble();
              double diff = (placeBearing - _bearing + 540) % 360 - 180;

              final bool isVisible = diff.abs() < (fov / 2);
              if (!isVisible) return const SizedBox.shrink();

              final double dist = (place['calculatedDistance'] as num).toDouble();
              // Depth-aware scaling: close places appear bigger, far places scale down
              final double depthScale = (1.15 - (dist / 15000.0)).clamp(0.85, 1.15);

              final double screenX = (screenSize.width / 2) + (diff / (fov / 2)) * (screenSize.width * 0.42);
              final double pLat = (place['lat'] as num).toDouble();
              // Stagger height so multiple tags in same direction never collide
              final double screenY = 200 + ((pLat * 1000).abs() % 160) + (_pitch * 1.2).clamp(-60.0, 60.0);

              final bool isSelected = (_selectedTarget?['id'] == place['id']) || (lockedPlace?['id'] == place['id']);
              final bool isFood = place['type'] == 'food';

              return Positioned(
                left: (screenX - 85).clamp(10.0, screenSize.width - 180),
                top: screenY.clamp(90.0, screenSize.height - 240),
                child: Transform.scale(
                  scale: depthScale,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedTarget = place;
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : Colors.white.withOpacity(0.92),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? const Color(0xFFD96B27) : (isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E)),
                          width: isSelected ? 2.5 : 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isSelected ? const Color(0xFFD96B27).withOpacity(0.4) : Colors.black26,
                            blurRadius: isSelected ? 12 : 6,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 26,
                            height: 26,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E),
                            ),
                            child: Icon(isFood ? Icons.restaurant : Icons.account_balance, color: Colors.white, size: 14),
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                place['title'],
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF151D1A)),
                              ),
                              Text(
                                '${_formatDistance(dist)} · ${place['walkMinutes']}p đi bộ · Hướng ${placeBearing.toStringAsFixed(0)}°',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),

            // 6. OFF-SCREEN DIRECTIONAL RADAR BEACON WITH THUMBNAIL
            if (guideArrowAngle != null)
              Positioned(
                top: screenSize.height * 0.44,
                left: guideArrowAngle < 0 ? 14 : null,
                right: guideArrowAngle > 0 ? 14 : null,
                child: GestureDetector(
                  onTap: () {
                    // Turn user smoothly towards destination
                    setState(() {
                      _targetBearing = ((_selectedTarget!['calculatedBearing'] as num).toDouble());
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD96B27),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 10)],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (guideArrowAngle < 0) ...[
                          const Icon(Icons.arrow_back, color: Colors.white, size: 16),
                          const SizedBox(width: 6),
                        ],
                        Text(
                          'Xoay ${guideArrowAngle < 0 ? 'trái' : 'phải'} ${guideArrowAngle.abs().toStringAsFixed(0)}°',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        if (guideArrowAngle > 0) ...[
                          const SizedBox(width: 6),
                          const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                        ],
                      ],
                    ),
                  ),
                ),
              ),

            // 7. TOP HUD: HEADING TAPE, CAMERA CONTROLS & AR FILTER PILLS
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.85), Colors.black.withOpacity(0.4), Colors.transparent],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back, color: Colors.white),
                          onPressed: () => Navigator.pop(context),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1B4D3E),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFF76A286)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.explore, color: Colors.white, size: 16),
                              const SizedBox(width: 6),
                              Text(
                                '${_bearing.toStringAsFixed(1)}° (${_getDirectionName(_bearing)})',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: Icon(_isSearchOpen ? Icons.close : Icons.search, color: Colors.white),
                              onPressed: () {
                                setState(() {
                                  _isSearchOpen = !_isSearchOpen;
                                  if (!_isSearchOpen) {
                                    _arSearchController.clear();
                                    _arSearchQuery = '';
                                  }
                                });
                              },
                            ),
                            IconButton(
                              icon: Icon(_isFlashOn ? Icons.flash_on : Icons.flash_off, color: _isFlashOn ? Colors.amber : Colors.white70),
                              onPressed: () async {
                                setState(() => _isFlashOn = !_isFlashOn);
                                try {
                                  if (_cameraController != null && _isCameraReady) {
                                    await _cameraController!.setFlashMode(_isFlashOn ? FlashMode.torch : FlashMode.off);
                                  }
                                } catch (_) {}
                              },
                            ),
                          ],
                        ),
                      ],
                    ),

                    // In-HUD Search Field
                    if (_isSearchOpen) ...[
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFD96B27)),
                        ),
                        child: TextField(
                          controller: _arSearchController,
                          onChanged: (val) => setState(() => _arSearchQuery = val),
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(
                            hintText: 'Tìm món ăn trong tầm ngắm (cơm tấm, phở...)...',
                            hintStyle: TextStyle(color: Colors.white54, fontSize: 12),
                            border: InputBorder.none,
                            icon: Icon(Icons.search, color: Color(0xFFD96B27), size: 18),
                          ),
                        ),
                      ),
                    ],

                    const SizedBox(height: 6),

                    // Live Compass Ruler Tape (0°-360°)
                    ClipRect(
                      child: SizedBox(
                        height: 28,
                        width: double.infinity,
                        child: CustomPaint(
                          painter: CompassTapePainter(bearing: _bearing),
                        ),
                      ),
                    ),

                    const SizedBox(height: 6),

                    // Smart AR Category Filter Pills
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildArFilterPill('all', 'Tất cả'),
                        const SizedBox(width: 8),
                        _buildArFilterPill('food', '🍴 Món ăn'),
                        const SizedBox(width: 8),
                        _buildArFilterPill('heritage', '🏛️ Di sản'),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // 8. Mini Radar Overlay (Top Right Corner)
            Positioned(
              top: 120,
              right: 14,
              child: Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black.withOpacity(0.65),
                  border: Border.all(color: const Color(0xFF76A286), width: 1.5),
                ),
                child: CustomPaint(
                  painter: ARMiniRadarPainter(bearing: _bearing, places: arPlaces),
                ),
              ),
            ),

            // 9. Camera Status Badge (Top Left Corner)
            Positioned(
              top: 120,
              left: 14,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _isCameraReady ? const Color(0xFF1B4D3E).withOpacity(0.85) : Colors.black54,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: _isCameraReady ? Colors.greenAccent : Colors.white30),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _isCameraReady ? Icons.videocam : Icons.sensors,
                      color: _isCameraReady ? Colors.greenAccent : Colors.white70,
                      size: 14,
                    ),
                    const SizedBox(width: 5),
                    Text(
                      _isCameraReady ? 'Camera Thật 60FPS' : 'La bàn cảm biến',
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),

            // 10. Selected Target Bottom Sheet Preview
            if (_selectedTarget != null || lockedPlace != null) ...[
              Builder(
                builder: (context) {
                  final target = _selectedTarget ?? lockedPlace!;
                  final isFood = target['type'] == 'food';
                  final isSpeaking = widget.isPlayingTTS && widget.speakingId == target['id'];
                  final double dist = (target['calculatedDistance'] as num).toDouble();
                  final double tb = (target['calculatedBearing'] as num).toDouble();
                  final int walkMin = target['walkMinutes'] as int;

                  return Positioned(
                    bottom: 75,
                    left: 14,
                    right: 14,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.96),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E), width: 1.5),
                        boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 16)],
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              target['image'],
                              width: 54,
                              height: 54,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  target['title'],
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF151D1A)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${_formatDistance(dist)} · $walkMin phút đi bộ · Hướng ${tb.toStringAsFixed(0)}° (${_getDirectionName(tb)})',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: isFood ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              widget.onToggleTTS(target['id'], target['title'], target['story'] ?? '');
                            },
                            icon: Icon(isSpeaking ? Icons.pause : Icons.volume_up, size: 16),
                            label: Text(isSpeaking ? 'Dừng' : 'Thuyết minh', style: const TextStyle(fontSize: 11)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1B4D3E),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],

            // 11. Bottom AR Bar (Zoom Controls + Reset Heading)
            Positioned(
              bottom: 16,
              left: 14,
              right: 14,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _targetBearing = 0.0;
                        _bearing = 0.0;
                        _selectedTarget = null;
                        widget.onUpdateBearing(0.0);
                      });
                    },
                    icon: const Icon(Icons.north, size: 14),
                    label: const Text('Bắc (0°)', style: TextStyle(fontSize: 11)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black.withOpacity(0.65),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      side: const BorderSide(color: Colors.white30),
                    ),
                  ),
                  Row(
                    children: [
                      _buildZoomButton(0.6, '0.6x'),
                      const SizedBox(width: 8),
                      _buildZoomButton(1.0, '1.0x'),
                      const SizedBox(width: 8),
                      _buildZoomButton(1.8, '1.8x'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildArFilterPill(String key, String label) {
    final isSelected = _arCategoryFilter == key;
    return GestureDetector(
      onTap: () => setState(() => _arCategoryFilter = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD96B27) : Colors.black.withOpacity(0.55),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isSelected ? Colors.white : Colors.white30),
        ),
        child: Text(
          label,
          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
        ),
      ),
    );
  }

  Widget _buildZoomButton(double zoom, String label) {
    final isSelected = _zoomLevel == zoom;
    return GestureDetector(
      onTap: () async {
        setState(() => _zoomLevel = zoom);
        try {
          if (_cameraController != null && _isCameraReady) {
            await _cameraController!.setZoomLevel(zoom);
          }
        } catch (_) {}
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD96B27) : Colors.black.withOpacity(0.65),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? Colors.white : Colors.white30),
        ),
        child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
      ),
    );
  }
}

// ============================================================================
// CUSTOM PAINTERS: ARTIFICIAL HORIZON, COMPASS TAPE, ROUTE BEAM, RADAR, GRID
// ============================================================================

// 1. Artificial Horizon Pitch Ladder (Aerospace Leveler)
class ArtificialHorizonPainter extends CustomPainter {
  final double pitch;
  ArtificialHorizonPainter({required this.pitch});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final pitchOffset = (pitch * 2.0).clamp(-120.0, 120.0);

    final horizonPaint = Paint()
      ..color = Colors.white.withOpacity(0.25)
      ..strokeWidth = 1.0;

    final pitchPaint = Paint()
      ..color = const Color(0xFF76A286).withOpacity(0.3)
      ..strokeWidth = 1.0;

    // Center Horizon Line
    final horizonY = center.dy + pitchOffset;
    canvas.drawLine(Offset(center.dx - 80, horizonY), Offset(center.dx - 25, horizonY), horizonPaint);
    canvas.drawLine(Offset(center.dx + 25, horizonY), Offset(center.dx + 80, horizonY), horizonPaint);

    // Pitch ladder rungs (+10°, -10°)
    for (int deg = -20; deg <= 20; deg += 10) {
      if (deg == 0) continue;
      final y = horizonY - deg * 3.5;
      if (y < 80 || y > size.height - 80) continue;

      final len = deg.abs() == 10 ? 30.0 : 45.0;
      canvas.drawLine(Offset(center.dx - len, y), Offset(center.dx + len, y), pitchPaint);
    }
  }

  @override
  bool shouldRepaint(covariant ArtificialHorizonPainter oldDelegate) => oldDelegate.pitch != pitch;
}

// 2. Dynamic Walking Route Beam Drawn on Map
class MapRouteBeamPainter extends CustomPainter {
  final double selectedBearing;
  final double selectedDistance;

  MapRouteBeamPainter({required this.selectedBearing, required this.selectedDistance});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    final radiusPx = (selectedDistance / 15.0).clamp(40.0, 220.0);
    final rad = (selectedBearing - 90) * (math.pi / 180);

    final targetPoint = Offset(center.dx + math.cos(rad) * radiusPx, center.dy + math.sin(rad) * radiusPx);

    // Glowing Laser Line
    final beamPaint = Paint()
      ..color = const Color(0xFFD96B27).withOpacity(0.8)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final glowPaint = Paint()
      ..color = const Color(0xFFD96B27).withOpacity(0.25)
      ..strokeWidth = 6.0
      ..style = PaintingStyle.stroke;

    canvas.drawLine(center, targetPoint, glowPaint);
    canvas.drawLine(center, targetPoint, beamPaint);

    // Pulsing Target Lock Circle
    final pulsePaint = Paint()
      ..color = const Color(0xFFD96B27).withOpacity(0.3)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(targetPoint, 26, pulsePaint);
  }

  @override
  bool shouldRepaint(covariant MapRouteBeamPainter oldDelegate) =>
      oldDelegate.selectedBearing != selectedBearing || oldDelegate.selectedDistance != selectedDistance;
}

class CompassDialPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final tickPaint = Paint()
      ..color = const Color(0xFF1B4D3E).withOpacity(0.4)
      ..strokeWidth = 1.2;

    for (int i = 0; i < 360; i += 15) {
      final rad = i * (math.pi / 180);
      final isMajor = (i % 90 == 0);
      final len = isMajor ? 12.0 : 6.0;

      final p1 = Offset(center.dx + math.cos(rad) * (radius - len), center.dy + math.sin(rad) * (radius - len));
      final p2 = Offset(center.dx + math.cos(rad) * radius, center.dy + math.sin(rad) * radius);

      canvas.drawLine(p1, p2, tickPaint);

      if (isMajor) {
        String label = 'E';
        if (i == 0) label = 'E';
        if (i == 90) label = 'S';
        if (i == 180) label = 'W';
        if (i == 270) label = 'N';

        final tp = TextPainter(
          text: TextSpan(
            text: label,
            style: TextStyle(
              color: label == 'N' ? const Color(0xFFD96B27) : const Color(0xFF1B4D3E),
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        tp.paint(canvas, Offset(p1.dx - tp.width / 2, p1.dy - tp.height / 2));
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class CompassTapePainter extends CustomPainter {
  final double bearing;
  CompassTapePainter({required this.bearing});

  @override
  void paint(Canvas canvas, Size size) {
    final double centerX = size.width / 2;
    const double pixelPerDegree = 4.0;

    final linePaint = Paint()..color = Colors.white70..strokeWidth = 1.0;
    final majorPaint = Paint()..color = const Color(0xFFD96B27)..strokeWidth = 2.0;

    final centerMarkerPaint = Paint()..color = const Color(0xFFD96B27)..style = PaintingStyle.fill;
    final path = Path()
      ..moveTo(centerX, 0)
      ..lineTo(centerX - 6, 8)
      ..lineTo(centerX + 6, 8)
      ..close();
    canvas.drawPath(path, centerMarkerPaint);

    for (int deg = -60; deg <= 60; deg += 5) {
      final double currentDeg = (bearing + deg + 360) % 360;
      final double x = centerX + deg * pixelPerDegree;
      if (x < 0 || x > size.width) continue;

      final bool isMajor = (currentDeg.round() % 45 == 0);
      final bool isMedium = (currentDeg.round() % 15 == 0);

      final double height = isMajor ? 14.0 : (isMedium ? 10.0 : 6.0);
      canvas.drawLine(Offset(x, 10), Offset(x, 10 + height), isMajor ? majorPaint : linePaint);

      if (isMajor) {
        String label = '${currentDeg.round()}°';
        if (currentDeg.round() == 0) label = 'N';
        if (currentDeg.round() == 45) label = 'NE';
        if (currentDeg.round() == 90) label = 'E';
        if (currentDeg.round() == 135) label = 'SE';
        if (currentDeg.round() == 180) label = 'S';
        if (currentDeg.round() == 225) label = 'SW';
        if (currentDeg.round() == 270) label = 'W';
        if (currentDeg.round() == 315) label = 'NW';

        final tp = TextPainter(
          text: TextSpan(text: label, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          textDirection: TextDirection.ltr,
        )..layout();
        tp.paint(canvas, Offset(x - (tp.width / 2), 24));
      }
    }
  }

  @override
  bool shouldRepaint(covariant CompassTapePainter oldDelegate) => oldDelegate.bearing != bearing;
}

class ARMiniRadarPainter extends CustomPainter {
  final double bearing;
  final List<Map<String, dynamic>> places;
  ARMiniRadarPainter({required this.bearing, required this.places});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final ringPaint = Paint()..color = Colors.white.withOpacity(0.18)..style = PaintingStyle.stroke..strokeWidth = 1.0;
    canvas.drawCircle(center, radius * 0.5, ringPaint);
    canvas.drawCircle(center, radius * 0.9, ringPaint);

    final conePaint = Paint()..color = const Color(0xFF76A286).withOpacity(0.3)..style = PaintingStyle.fill;
    final coneAngleRad = bearing * (math.pi / 180);
    const fovHalfRad = (35.0) * (math.pi / 180);

    final conePath = Path()
      ..moveTo(center.dx, center.dy)
      ..arcTo(Rect.fromCircle(center: center, radius: radius * 0.95), coneAngleRad - (math.pi / 2) - fovHalfRad, fovHalfRad * 2, false)
      ..close();
    canvas.drawPath(conePath, conePaint);

    canvas.drawCircle(center, 3, Paint()..color = Colors.white);

    for (final p in places) {
      final double pb = (p['calculatedBearing'] as num).toDouble();
      final double rad = (pb - 90) * (math.pi / 180);
      final double dist = (p['calculatedDistance'] as num).toDouble();
      final double distRatio = (dist / 15000.0).clamp(0.25, 0.85);

      final double px = center.dx + math.cos(rad) * (radius * distRatio);
      final double py = center.dy + math.sin(rad) * (radius * distRatio);

      final isFood = p['type'] == 'food';
      canvas.drawCircle(Offset(px, py), 2.5, Paint()..color = isFood ? const Color(0xFFD96B27) : const Color(0xFF76A286));
    }
  }

  @override
  bool shouldRepaint(covariant ARMiniRadarPainter oldDelegate) => oldDelegate.bearing != bearing;
}

class VisualMapCanvasPainter extends CustomPainter {
  final double userBearing;
  VisualMapCanvasPainter({required this.userBearing});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    final ringPaint = Paint()
      ..color = const Color(0xFF1B4D3E).withOpacity(0.12)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    const radii = [60.0, 110.0, 160.0, 210.0];
    const labels = ['500m', '1 km', '2 km', '5 km'];

    for (int i = 0; i < radii.length; i++) {
      canvas.drawCircle(center, radii[i], ringPaint);

      final tp = TextPainter(
        text: TextSpan(text: labels[i], style: TextStyle(color: const Color(0xFF1B4D3E).withOpacity(0.5), fontSize: 9, fontWeight: FontWeight.bold)),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(center.dx + 4, center.dy - radii[i] - 10));
    }

    final axisPaint = Paint()..color = const Color(0xFF1B4D3E).withOpacity(0.08)..strokeWidth = 1.0;
    canvas.drawLine(Offset(center.dx, 10), Offset(center.dx, size.height - 10), axisPaint);
    canvas.drawLine(Offset(10, center.dy), Offset(size.width - 10, center.dy), axisPaint);
  }

  @override
  bool shouldRepaint(covariant VisualMapCanvasPainter oldDelegate) => oldDelegate.userBearing != userBearing;
}

class ARGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final bracketPaint = Paint()..color = Colors.white.withOpacity(0.3)..strokeWidth = 1.5..style = PaintingStyle.stroke;
    const bSize = 24.0;
    const margin = 20.0;

    canvas.drawPath(Path()..moveTo(margin, margin + bSize)..lineTo(margin, margin)..lineTo(margin + bSize, margin), bracketPaint);
    canvas.drawPath(Path()..moveTo(size.width - margin - bSize, margin)..lineTo(size.width - margin, margin)..lineTo(size.width - margin, margin + bSize), bracketPaint);
    canvas.drawPath(Path()..moveTo(margin, size.height - margin - bSize)..lineTo(margin, size.height - margin)..lineTo(margin + bSize, size.height - margin), bracketPaint);
    canvas.drawPath(Path()..moveTo(size.width - margin - bSize, size.height - margin)..lineTo(size.width - margin, size.height - margin)..lineTo(size.width - margin, size.height - margin - bSize), bracketPaint);
  }

  @override
  bool shouldRepaint(covariant ARGridPainter oldDelegate) => false;
}
