export interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface LandmarkRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  badge: string;
  location: string;
  ar_heading: number;
  rating: number;
  image_url: string;
  has_3d_mesh: boolean;
  has_audio: boolean;
  linked_foods_count?: number;
}

export interface CulinaryRecord {
  id: string;
  code: string;
  name: string;
  origin_region: string;
  allergens_fr08: string;
  price_range: string;
  total_restaurants: number;
  image_url: string;
}

export interface AllergenRecord {
  id: string;
  code: string;
  name: string;
  risk_level: 'danger' | 'warning' | 'safe' | 'info';
  symptoms_desc: string;
  common_in_dishes: string;
  created_at: string;
}

export interface RestaurantRecord {
  id: string;
  code: string;
  name: string;
  owner_name: string;
  specialty_dish: string;
  location: string;
  verification_status: 'Pending' | 'Verified' | 'Need Inspection';
  safety_license: string;
  audit_passed: string;
  ar_matching_percent: number;
}

export interface UrgentTaskRecord {
  id: string;
  name: string;
  address: string;
  dishName: string;
  coords: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface CalibrationAlertRecord {
  id: string;
  landmarkName: string;
  viewportDesc: string;
  errorDesc: string;
  errorDelta: string;
  reason: string;
  reportedByUsers: number;
  actionText: string;
  resolved: boolean;
}

export interface ActivityLogRecord {
  id: string;
  userName: string;
  userRole: string;
  timeAgo: string;
  actionDesc: string;
  tags?: string[];
  createdAt: string;
}

export interface TelemetryLog {
  id: string;
  deviceId?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  compassBearing: number;
  timestamp: string;
}

// Canonical Database Engine synchronized with MySQL Workbench schema
class DatabaseClient {
  private users: UserRecord[] = [
    {
      id: 'user-1',
      full_name: 'Minh Quân',
      email: 'minhquan.admin@heritage.vn',
      role: 'Super Admin',
      status: 'Active',
    },
    {
      id: 'user-2',
      full_name: 'Thanh Hương',
      email: 'thanhhuong.auditor@heritage.vn',
      role: 'Thẩm định viên',
      status: 'Active',
    },
    {
      id: 'user-3',
      full_name: 'Hoàng Nam',
      email: 'hoangnam.ar@heritage.vn',
      role: 'Điều phối viên AR',
      status: 'Active',
    },
    {
      id: 'user-4',
      full_name: 'Trần Quốc Toản',
      email: 'quoctoan.inspector@heritage.vn',
      role: 'Thanh tra thực địa',
      status: 'Active',
    },
    {
      id: 'user-5',
      full_name: 'Vũ Minh Trang',
      email: 'minhtrang.content@heritage.vn',
      role: 'Biên tập viên di sản',
      status: 'Active',
    },
  ];

  private landmarks: LandmarkRecord[] = [
    {
      id: 'lm-1',
      code: 'DT-HN-00104',
      name: 'Chùa Một Cột',
      category: 'Lịch sử',
      badge: 'QG-ĐB',
      location: 'Phố Chùa Một Cột, Đội Cấn, Ba Đình | 21.0359, 105.8336',
      ar_heading: 142.4,
      rating: 4.9,
      image_url: '/src/assets/images/one_pillar_pagoda_1793939012094.jpg',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 8,
    },
    {
      id: 'lm-2',
      code: 'DT-HN-00002',
      name: 'Hoàng Thành Thăng Long',
      category: 'Lịch sử',
      badge: 'UNESCO',
      location: '19C Hoàng Diệu, Điện Biên, Ba Đình | 21.0344, 105.8407',
      ar_heading: 89.2,
      rating: 4.8,
      image_url: '/src/assets/images/ar_hanoi_view_1793939014182.jpg',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 14,
    },
    {
      id: 'lm-3',
      code: 'DT-HN-00018',
      name: 'Văn Miếu - Quốc Tử Giám',
      category: 'Kiến trúc',
      badge: 'QG-ĐB',
      location: '58 Quốc Tử Giám, Văn Miếu, Đống Đa | 21.0285, 105.8355',
      ar_heading: 180.0,
      rating: 4.9,
      image_url: '/src/assets/images/temple_of_literature_1793939013104.jpg',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 9,
    },
    {
      id: 'lm-4',
      code: 'DT-HN-00007',
      name: 'Tháp Rùa - Hồ Hoàn Kiếm',
      category: 'Danh thắng',
      badge: 'DT-LS',
      location: 'Hồ Gươm, Hàng Trống, Hoàn Kiếm | 21.0287, 105.8524',
      ar_heading: 56.9,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 22,
    },
    {
      id: 'lm-5',
      code: 'DT-HN-00045',
      name: 'Di tích Lịch sử Nhà Tù Hỏa Lò',
      category: 'Lịch sử',
      badge: 'QG-ĐB',
      location: '1 Hỏa Lò, Trần Hưng Đạo, Hoàn Kiếm | 21.0253, 105.8465',
      ar_heading: 215.0,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 12,
    },
    {
      id: 'lm-6',
      code: 'DT-HN-00089',
      name: 'Nhà Thờ Lớn Hà Nội',
      category: 'Kiến trúc',
      badge: 'DT-LS',
      location: '40 Nhà Chung, Hàng Trống, Hoàn Kiếm | 21.0305, 105.8496',
      ar_heading: 75.3,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 18,
    },
    {
      id: 'lm-7',
      code: 'DT-SG-00001',
      name: 'Chợ Bến Thành',
      category: 'Lịch sử',
      badge: 'DT-LS',
      location: 'Đường Lê Lợi, Phường Bến Thành, Quận 1 | 10.7725, 106.6980',
      ar_heading: 195.0,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 26,
    },
    {
      id: 'lm-8',
      code: 'DT-SG-00002',
      name: 'Dinh Độc Lập (Hội trường Thống Nhất)',
      category: 'Lịch sử',
      badge: 'QG-ĐB',
      location: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1 | 10.7770, 106.6954',
      ar_heading: 310.5,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      has_3d_mesh: true,
      has_audio: true,
      linked_foods_count: 15,
    },
  ];

  private culinaryItems: CulinaryRecord[] = [
    {
      id: 'dish-1',
      code: 'DS-AMTHUC-014',
      name: 'Bún Chả Hà Nội',
      origin_region: 'Hà Nội (Kinh Kỳ)',
      allergens_fr08: 'Thịt lợn, Nước mắm cá, Không Gluten (GF)',
      price_range: '50.000 - 80.000 đ',
      total_restaurants: 342,
      image_url: '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    },
    {
      id: 'dish-2',
      code: 'DS-AMTHUC-001',
      name: 'Phở Bò Khói Hôi (Gia Truyền)',
      origin_region: 'Nam Định / Hà Nội Cổ',
      allergens_fr08: 'Thịt bò, Không Gluten (Bánh gạo), Hồi • Quế',
      price_range: '55.000 - 95.000 đ',
      total_restaurants: 512,
      image_url: '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    },
    {
      id: 'dish-3',
      code: 'DS-AMTHUC-003',
      name: 'Chả Cá Lã Vọng',
      origin_region: 'Phố Cổ Hoàn Kiếm (Năm 1871)',
      allergens_fr08: 'Chứa mắm tôm, Lạc rang (Đậu phộng), Cá da trơn',
      price_range: '150.000 - 220.000 đ',
      total_restaurants: 88,
      image_url: '/src/assets/images/cha_ca_la_vong_1793939014472.jpg',
    },
    {
      id: 'dish-4',
      code: 'DS-AMTHUC-008',
      name: 'Bún Ốc Nguội Phố Cổ',
      origin_region: 'Tây Hồ - Ô Quan Chưởng',
      allergens_fr08: 'Thân mềm (Ốc/Sò), Giấm bỗng, Không Gluten',
      price_range: '40.000 - 65.000 đ',
      total_restaurants: 45,
      image_url: '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    },
    {
      id: 'dish-5',
      code: 'DS-AMTHUC-021',
      name: 'Bánh Cuốn Tráng Tay Mộc Nhĩ',
      origin_region: 'Thanh Trì - Hà Nội',
      allergens_fr08: 'Bột gạo, Nước mắm cá, Không Gluten, Thịt lợn',
      price_range: '35.000 - 55.000 đ',
      total_restaurants: 164,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'dish-6',
      code: 'DS-AMTHUC-035',
      name: 'Xôi Xéo Lá Sen Mỡ Hành',
      origin_region: 'Làng Tương Mai, Thăng Long',
      allergens_fr08: 'Gạo nếp cái hoa vàng, Đậu xanh, Mỡ lợn',
      price_range: '20.000 - 45.000 đ',
      total_restaurants: 218,
      image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'dish-7',
      code: 'DS-AMTHUC-042',
      name: 'Cơm Tấm Sườn Bì Chả Trứng',
      origin_region: 'Sài Gòn - Chợ Lớn',
      allergens_fr08: 'Thịt heo nướng, Nước mắm kẹo, Trứng gà',
      price_range: '45.000 - 85.000 đ',
      total_restaurants: 620,
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'dish-8',
      code: 'DS-AMTHUC-050',
      name: 'Bánh Mì Thập Cẩm Patê Bơ Pháp',
      origin_region: 'Sài Gòn / Hà Nội',
      allergens_fr08: 'Chứa Gluten (Bột mì), Patê gan heo, Bơ sữa',
      price_range: '30.000 - 65.000 đ',
      total_restaurants: 850,
      image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80',
    },
  ];

  private allergenLabels: AllergenRecord[] = [
    {
      id: 'alg-1',
      code: 'FR08-ALG-01',
      name: 'Mắm tôm / Mắm tép / Mắm ruốc',
      risk_level: 'danger',
      symptoms_desc: 'Chứa đạm giáp xác lên men, dị ứng histamin cao, ngứa cổ & nổi mề đay',
      common_in_dishes: 'Bún đậu mắm tôm, Chả cá Lã Vọng, Bún thang, Bún riêu',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'alg-2',
      code: 'FR08-ALG-02',
      name: 'Lạc rang / Đậu phộng',
      risk_level: 'danger',
      symptoms_desc: 'Gây dị ứng protein lạc nghiêm trọng, có nguy cơ sốc phản vệ cao',
      common_in_dishes: 'Nộm bò khô, Chả cá Lã Vọng, Xôi xéo, Gỏi cuốn Sài Gòn',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'alg-3',
      code: 'FR08-ALG-03',
      name: 'Thân mềm (Ốc bươu / Sò huyết / Hến)',
      risk_level: 'danger',
      symptoms_desc: 'Dị nguyên nhóm nhuyễn thể Mollusca, khó tiêu hóa đối với cơ địa nhạy cảm',
      common_in_dishes: 'Bún ốc nguội phố cổ, Canh hến xứ Huế, Ốc nấu chuối đậu',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'alg-4',
      code: 'FR08-ALG-04',
      name: 'Thịt lợn / Mỡ lợn phi',
      risk_level: 'warning',
      symptoms_desc: 'Cần lưu ý cho du khách theo chế độ ăn kiêng tôn giáo (Halal/Kosher) hoặc thuần chay',
      common_in_dishes: 'Bún chả nướng than hoa, Xôi xéo mỡ hành, Bánh cuốn nhân thịt',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'alg-5',
      code: 'FR08-ALG-05',
      name: 'Không chứa Gluten (Gluten-Free GF)',
      risk_level: 'safe',
      symptoms_desc: 'Thành phần hoàn toàn từ bột gạo truyền thống hoặc đỗ xanh, an toàn tuyệt đối với người bệnh Celiac',
      common_in_dishes: 'Phở bò truyền thống, Bánh cuốn tráng tay, Bún tươi sợi tròn',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'alg-6',
      code: 'FR08-ALG-06',
      name: 'Quế chi • Hoa hồi • Thảo quả',
      risk_level: 'warning',
      symptoms_desc: 'Gia vị thảo mộc cay nồng tự nhiên, người có cơ địa kích ứng niêm mạc cần giảm lượng dùng',
      common_in_dishes: 'Nước dùng Phở bò gia truyền 24h, Bò sốt vang, Bò kho',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'alg-7',
      code: 'FR08-ALG-07',
      name: 'Trứng gia cầm (Gà / Vịt)',
      risk_level: 'warning',
      symptoms_desc: 'Dị ứng protein lòng trắng Ovalbumin, phát ban ngoài da nhẹ',
      common_in_dishes: 'Cơm tấm chả trứng hấp, Bánh mì kẹp trứng ốp la, Bún thang thái chỉ',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'alg-8',
      code: 'FR08-ALG-08',
      name: 'Cá da trơn (Cá lăng / Cá quả / Cá tra)',
      risk_level: 'warning',
      symptoms_desc: 'Dị nguyên Parvalbumin từ cá nước ngọt và cá da trơn béo',
      common_in_dishes: 'Chả cá Lã Vọng xèo xèo, Canh chua cá lăng, Bún cá rô đồng',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'alg-9',
      code: 'FR08-ALG-09',
      name: 'Bơ sữa động vật & Patê gan',
      risk_level: 'danger',
      symptoms_desc: 'Chứa lactose động vật và purin nội tạng, người bất dung nạp đường sữa cần tránh',
      common_in_dishes: 'Bánh mì Sài Gòn thập cẩm, Bánh mì chảo patê cột điện',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'alg-10',
      code: 'FR08-ALG-10',
      name: 'Tôm khô / Tép giòn nước ngọt',
      risk_level: 'danger',
      symptoms_desc: 'Dị ứng Tropomyosin trong giáp xác, sưng môi mắt khi ăn lượng nhiều',
      common_in_dishes: 'Bún riêu cua đồng tóp mỡ, Nước mắm chua ngọt chấm bánh bèo',
      created_at: new Date().toISOString(),
    },
  ];

  private restaurants: RestaurantRecord[] = [
    {
      id: 'res-1',
      code: 'HN-BC-092',
      name: 'Bún Chả Hương Liên',
      owner_name: 'Nguyễn Thị Liên',
      specialty_dish: 'Bún chả Hà Nội (Nem cua bể, Thịt nướng than hoa)',
      location: '24 Lê Văn Hưu, Hoàn Kiếm | 21.0189, 105.8532',
      verification_status: 'Pending',
      safety_license: 'GP ATTP số 482/2023/ATTP-HN',
      audit_passed: '3/3 Tiêu chí đạt',
      ar_matching_percent: 99,
    },
    {
      id: 'res-2',
      code: 'HN-HQ-011',
      name: 'Bún Chả Hàng Quạt',
      owner_name: 'Bùi Văn Quý',
      specialty_dish: 'Bún chả gia truyền (Chả nướng nan tre lá lốt)',
      location: 'Ngõ 74 Hàng Quạt, Hoàn Kiếm | 21.0331, 105.8504',
      verification_status: 'Need Inspection',
      safety_license: 'GP ATTP số 112/2022/ATTP-HN',
      audit_passed: '2/3 Chỉ tiêu (Thiếu thực địa)',
      ar_matching_percent: 91,
    },
    {
      id: 'res-3',
      code: 'HN-PT-001',
      name: 'Phở Thìn Bờ Hồ',
      owner_name: 'Bùi Thị Thìn',
      specialty_dish: 'Phở bò tái chín (Gia truyền từ năm 1955)',
      location: '61 Đinh Tiên Hoàng, Hoàn Kiếm | 21.0315, 105.8524',
      verification_status: 'Verified',
      safety_license: 'GP ATTP số 005/2021/ATTP-HN',
      audit_passed: 'Đã kiểm duyệt hoàn tất',
      ar_matching_percent: 100,
    },
    {
      id: 'res-4',
      code: 'HN-CC-034',
      name: 'Chả Cá Thăng Long',
      owner_name: 'Nguyễn Phúc Anh',
      specialty_dish: 'Chả cá lăng di sản (Gia vị thì là mắm tôm)',
      location: '19 Đường Thành, Hoàn Kiếm | 21.0326, 105.8459',
      verification_status: 'Verified',
      safety_license: 'GP ATTP số 230/2023/ATTP-HN',
      audit_passed: 'Hồ sơ hợp lệ',
      ar_matching_percent: 96,
    },
    {
      id: 'res-5',
      code: 'HN-BD-015',
      name: 'Phở Gia Truyền Bát Đàn',
      owner_name: 'Nguyễn Trung Kiên',
      specialty_dish: 'Phở bò tái lăn niêu đất 14 tiếng',
      location: '49 Bát Đàn, Cửa Đông, Hoàn Kiếm | 21.0337, 105.8465',
      verification_status: 'Verified',
      safety_license: 'GP ATTP số 319/2022/ATTP-HN',
      audit_passed: 'Đạt chuẩn di sản ẩm thực',
      ar_matching_percent: 100,
    },
    {
      id: 'res-6',
      code: 'HN-BH-008',
      name: 'Bánh Cuốn Bà Hoành',
      owner_name: 'Trần Bích Hoành',
      specialty_dish: 'Bánh cuốn tráng tay mộc nhĩ chả quế giòn',
      location: '66 Tô Hiến Thành, Hai Bà Trưng | 21.0142, 105.8508',
      verification_status: 'Verified',
      safety_license: 'GP ATTP số 104/2023/ATTP-HN',
      audit_passed: 'Đã kiểm duyệt hoàn tất',
      ar_matching_percent: 98,
    },
    {
      id: 'res-7',
      code: 'SG-BG-001',
      name: 'Cơm Tấm Ba Ghiền',
      owner_name: 'Trương Vĩnh Phúc',
      specialty_dish: 'Cơm tấm sườn nướng mật ong khổng lồ',
      location: '84 Đặng Văn Ngữ, Phú Nhuận, TP.HCM | 10.7932, 106.6715',
      verification_status: 'Verified',
      safety_license: 'GP ATTP số 678/2023/ATTP-HCM',
      audit_passed: 'Đạt chuẩn Michelin Bib Gourmand',
      ar_matching_percent: 99,
    },
    {
      id: 'res-8',
      code: 'SG-HH-022',
      name: 'Bánh Mì Huỳnh Hoa',
      owner_name: 'Huỳnh Thị Hoa',
      specialty_dish: 'Bánh mì ô môi patê bơ sốt đặc biệt',
      location: '26 Lê Thị Riêng, Quận 1, TP.HCM | 10.7712, 106.6924',
      verification_status: 'Pending',
      safety_license: 'GP ATTP số 912/2023/ATTP-HCM',
      audit_passed: 'Đang thẩm định hồ sơ thực địa',
      ar_matching_percent: 95,
    },
  ];

  private urgentTasks: UrgentTaskRecord[] = [
    {
      id: 'task-1',
      name: 'Bún Chả Cửa Đông',
      address: '41 Cửa Đông, Hoàn Kiếm, HN',
      dishName: 'Bún chả que tre than hoa',
      coords: '21.0331° N, 105.8450° E',
      status: 'pending',
    },
    {
      id: 'task-2',
      name: 'Bánh Cuốn Bà Hoành',
      address: '66 Tô Hiến Thành, Hai Bà Trưng, HN',
      dishName: 'Bánh cuốn chả quế tráng tay',
      coords: '21.0152° N, 105.8504° E',
      status: 'verified',
    },
    {
      id: 'task-3',
      name: 'Chả Cá Lã Vọng Đoàn Thị Điểm',
      address: '19 Đoàn Thị Điểm, Đống Đa, HN',
      dishName: 'Chả cá lăng cổ truyền',
      coords: '21.0256° N, 105.8312° E',
      status: 'pending',
    },
    {
      id: 'task-4',
      name: 'Cốm Mộc Làng Vòng Bà Ánh',
      address: 'Dịch Vọng Hậu, Cầu Giấy, HN',
      dishName: 'Cốm tươi non bọc lá sen',
      coords: '21.0368° N, 105.7876° E',
      status: 'pending',
    },
    {
      id: 'task-5',
      name: 'Phở Gia Truyền Bát Đàn',
      address: '49 Bát Đàn, Hoàn Kiếm, HN',
      dishName: 'Phở bò tái nạm gầu giòn',
      coords: '21.0337° N, 105.8471° E',
      status: 'verified',
    },
  ];

  private calibrationAlerts: CalibrationAlertRecord[] = [
    {
      id: 'calib-1',
      landmarkName: 'Đền Ngọc Sơn (Tháp Rùa Viewport)',
      viewportDesc: 'La bàn số trên thiết bị ghi nhận nhiều từ trường khi du khách đứng gần cầu Thê Húc.',
      errorDesc: 'Lệch',
      errorDelta: '+4.2m',
      reason: 'Nhiễu từ trường cầu Thê Húc',
      reportedByUsers: 18,
      actionText: 'Hiệu chuẩn lại Mesh 3D',
      resolved: false,
    },
    {
      id: 'calib-2',
      landmarkName: 'Ô Quan Chưởng (Cổng Vòm Cổ)',
      viewportDesc: 'Điểm neo thực tế ảo (AR Anchor) bị bóng che trong điều kiện ánh sáng lúc hoàng hôn.',
      errorDesc: 'Anchor trôi',
      errorDelta: '1.8m',
      reason: 'Độ tương phản ánh sáng thấp lúc chiều tà',
      reportedByUsers: 7,
      actionText: 'Cập nhật Keypoint Visual',
      resolved: false,
    },
    {
      id: 'calib-3',
      landmarkName: 'Cột Cờ Hà Nội (Kỳ Đài)',
      viewportDesc: 'Cần đồng bộ lại phương vị góc ngắm AR la bàn 142.4° SE để tránh chồng lấn đường chân trời.',
      errorDesc: 'Lệch la bàn',
      errorDelta: '2.1°',
      reason: 'Độ trễ cảm biến từ trường khi xoay máy',
      reportedByUsers: 12,
      actionText: 'Cân chỉnh Gyroscope',
      resolved: false,
    },
  ];

  private activityLogs: ActivityLogRecord[] = [
    {
      id: 'log-1',
      userName: 'Minh Quân',
      userRole: 'Super Admin',
      timeAgo: '10 phút trước',
      actionDesc: 'Đã tải lên và gắn thẻ không gian mô hình 3D AR mới: Chùa Một Cột (Diên Hựu Tự)',
      tags: ['GLTF 24.8MB', 'LOD 4'],
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: 'log-2',
      userName: 'Thanh Hương',
      userRole: 'Thẩm định viên',
      timeAgo: '35 phút trước',
      actionDesc: 'Đã phê duyệt hồ sơ địa điểm & công thức đặc sản: Bún Chả Hương Liên (Lê Văn Hưu). Gắn huy hiệu Di sản Ẩm thực.',
      tags: ['Tích xanh AR', 'RTK ±1.1m'],
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    },
    {
      id: 'log-3',
      userName: 'Hệ thống Tự động',
      userRole: 'FR08 Guard',
      timeAgo: '1 giờ trước',
      actionDesc: 'Cập nhật bộ từ khóa cảnh báo dị ứng cho thành phần Mắm cáy & Mắm ruốc. Đồng bộ 12 quán ăn khu vực Hà Nội.',
      tags: ['FR08 Level 4', '12 quán'],
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      id: 'log-4',
      userName: 'Hoàng Nam',
      userRole: 'Điều phối viên',
      timeAgo: '3 giờ trước',
      actionDesc: 'Cập nhật tọa độ Geofence bán kính 50m quanh Văn Miếu - Quốc Tử Giám.',
      tags: ['Geofence 50m', 'AR Anchor'],
      createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    },
    {
      id: 'log-5',
      userName: 'Trần Quốc Toản',
      userRole: 'Thanh tra thực địa',
      timeAgo: '5 giờ trước',
      actionDesc: 'Kiểm tra đo đạc thực địa GPS RTK tại Phở Thìn Bờ Hồ, sai số đạt chuẩn ±0.8m.',
      tags: ['GPS RTK', 'Kiểm định'],
      createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    },
  ];

  private telemetryLogs: TelemetryLog[] = [];
  private userBookmarks: Set<string> = new Set(['lm-1', 'dish-1']);

  // Users
  public getUsers() {
    return this.users;
  }

  // Landmarks
  public getLandmarks(search?: string) {
    if (!search) return this.landmarks;
    const q = search.toLowerCase();
    return this.landmarks.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }

  public getLandmarkById(id: string) {
    return this.landmarks.find((l) => l.id === id) || null;
  }

  public addLandmark(item: Omit<LandmarkRecord, 'id'>) {
    const newLandmark: LandmarkRecord = {
      ...item,
      id: `lm-${Date.now()}`,
    };
    this.landmarks.unshift(newLandmark);
    this.addActivityLog({
      userName: 'Minh Quân',
      userRole: 'Super Admin',
      timeAgo: 'Vừa xong',
      actionDesc: `Đã nạp hồ sơ di tích mới: ${newLandmark.name} (${newLandmark.code}) vào cơ sở dữ liệu.`,
      tags: ['Di tích mới', 'Chuẩn WGS84'],
    });
    return newLandmark;
  }

  // Culinary Items
  public getCulinaryItems(search?: string) {
    if (!search) return this.culinaryItems;
    const q = search.toLowerCase();
    return this.culinaryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.origin_region.toLowerCase().includes(q) ||
        item.allergens_fr08.toLowerCase().includes(q)
    );
  }

  public getCulinaryItemById(id: string) {
    return this.culinaryItems.find((f) => f.id === id) || null;
  }

  public addCulinaryItem(item: Omit<CulinaryRecord, 'id'>) {
    const newDish: CulinaryRecord = {
      ...item,
      id: `dish-${Date.now()}`,
    };
    this.culinaryItems.unshift(newDish);
    this.addActivityLog({
      userName: 'Vũ Minh Trang',
      userRole: 'Biên tập viên di sản',
      timeAgo: 'Vừa xong',
      actionDesc: `Đã bổ sung món ăn di sản mới: ${newDish.name} (${newDish.origin_region}) chuẩn hóa nhãn FR08.`,
      tags: ['Món ăn di sản', 'FR08 Active'],
    });
    return newDish;
  }

  // Allergen Labels
  public getAllergens(search?: string) {
    if (!search) return this.allergenLabels;
    const q = search.toLowerCase();
    return this.allergenLabels.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.symptoms_desc.toLowerCase().includes(q) ||
        a.common_in_dishes.toLowerCase().includes(q)
    );
  }

  public addAllergen(item: Omit<AllergenRecord, 'id' | 'created_at'>) {
    const newAllergen: AllergenRecord = {
      ...item,
      id: `alg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.allergenLabels.unshift(newAllergen);
    this.addActivityLog({
      userName: 'Hệ thống Tự động',
      userRole: 'FR08 Guard',
      timeAgo: 'Vừa xong',
      actionDesc: `Đã thiết lập nhãn cảnh báo dị ứng quốc tế mới: ${newAllergen.name} (${newAllergen.code}).`,
      tags: ['FR08 Mới', newAllergen.risk_level.toUpperCase()],
    });
    return newAllergen;
  }

  // Restaurants
  public getRestaurants(search?: string) {
    if (!search) return this.restaurants;
    const q = search.toLowerCase();
    return this.restaurants.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.owner_name.toLowerCase().includes(q) ||
        item.specialty_dish.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }

  public getRestaurantById(id: string) {
    return this.restaurants.find((r) => r.id === id) || null;
  }

  public updateRestaurantStatus(id: string, status: 'Verified' | 'Pending' | 'Need Inspection') {
    const restaurant = this.restaurants.find((r) => r.id === id);
    if (restaurant) {
      restaurant.verification_status = status;
      if (status === 'Verified') {
        restaurant.audit_passed = 'Đã kiểm duyệt hoàn tất';
      }
      return restaurant;
    }
    return null;
  }

  // Urgent Tasks
  public getUrgentTasks() {
    return this.urgentTasks;
  }

  public updateUrgentTaskStatus(id: string, status: 'pending' | 'verified' | 'rejected') {
    const task = this.urgentTasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      if (status === 'verified') {
        this.addActivityLog({
          userName: 'Minh Quân',
          userRole: 'Super Admin',
          timeAgo: 'Vừa xong',
          actionDesc: `Đã phê duyệt nhanh hồ sơ thực địa cho cơ sở "${task.name}" (${task.dishName}).`,
          tags: ['Duyệt nhanh', 'Tích xanh'],
        });
      }
      return task;
    }
    return null;
  }

  // Calibration Alerts
  public getCalibrationAlerts() {
    return this.calibrationAlerts;
  }

  public resolveCalibrationAlert(id: string) {
    const alert = this.calibrationAlerts.find((a) => a.id === id);
    if (alert) {
      alert.resolved = true;
      this.addActivityLog({
        userName: 'Hoàng Nam',
        userRole: 'Điều phối viên AR',
        timeAgo: 'Vừa xong',
        actionDesc: `Đã hoàn tất hiệu chuẩn không gian cho ${alert.landmarkName} (Sai số ${alert.errorDelta}).`,
        tags: ['Hiệu chuẩn AR', 'Độ trễ 0ms'],
      });
      return alert;
    }
    return null;
  }

  // Activity Logs
  public getActivityLogs() {
    return this.activityLogs;
  }

  public addActivityLog(log: Omit<ActivityLogRecord, 'id' | 'createdAt'>) {
    const newLog: ActivityLogRecord = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.activityLogs.unshift(newLog);
    if (this.activityLogs.length > 50) {
      this.activityLogs.pop();
    }
    return newLog;
  }

  // Overview stats
  public getOverviewStats() {
    const verifiedCount = this.restaurants.filter((r) => r.verification_status === 'Verified').length;
    const pendingCount = this.restaurants.filter((r) => r.verification_status === 'Pending').length;
    return {
      landmarksActive: this.landmarks.length,
      landmarksNew3D: this.landmarks.filter((l) => l.has_3d_mesh).length,
      landmarksGrowthPercent: 14,
      culinaryItems: this.culinaryItems.length,
      culinaryAllergens: this.allergenLabels.length,
      restaurantsTotal: this.restaurants.length,
      restaurantsPending: pendingCount,
      restaurantsVerified: verifiedCount,
      arScansTotal: 45820,
      arScansGrowthPercent: 28.4,
      retentionRate: 82,
      urgentTasks: this.urgentTasks,
      calibrationAlerts: this.calibrationAlerts,
      activityLogs: this.activityLogs,
    };
  }

  // Telemetry logs
  public saveTelemetryLog(data: Omit<TelemetryLog, 'id' | 'timestamp'>) {
    const log: TelemetryLog = {
      ...data,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.telemetryLogs.unshift(log);
    if (this.telemetryLogs.length > 100) {
      this.telemetryLogs.pop();
    }
    return log;
  }

  public getRecentLogs(limit = 10) {
    return this.telemetryLogs.slice(0, limit);
  }

  // Bookmarks
  public getBookmarks() {
    return Array.from(this.userBookmarks);
  }

  public toggleBookmark(id: string) {
    if (this.userBookmarks.has(id)) {
      this.userBookmarks.delete(id);
      return false;
    } else {
      this.userBookmarks.add(id);
      return true;
    }
  }
}

export const db = new DatabaseClient();
