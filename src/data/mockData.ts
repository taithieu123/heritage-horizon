import { HeritageItem, FoodItem } from '../types';

export const HERITAGE_LANDMARKS: HeritageItem[] = [
  {
    id: 'heritage-1',
    title: 'Chùa Một Cột',
    subtitle: 'Diên Hựu Tự - Biểu tượng đóa sen nghìn năm Thăng Long',
    category: 'heritage',
    imageUrl: '/src/assets/images/one_pillar_pagoda_1793939012094.jpg',
    distanceMeters: 250,
    bearingDegrees: 60.7,
    hasAudioTour: true,
    audioDurationMinutes: 4.5,
    audioNarrationText: 'Chào mừng bạn đến với Chùa Một Cột, hay còn gọi là Diên Hựu Tự. Ngôi chùa được vua Lý Thái Tông khởi dựng vào mùa đông năm Kỷ Sửu 1049 sau một giấc chiêm bao thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua lên tòa. Chùa được thiết kế độc đáo như một bông hoa sen nở trên mặt hồ Linh Chiểu bằng trụ đá nguyên khối...',
    yearBuilt: 'Năm 1049 (Thời Lý)',
    era: 'Triều Lý thịnh vượng',
    address: 'Phố Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
    coordinates: {
      lat: 21.0358,
      lng: 105.8336,
    },
    description: 'Chùa Một Cột sở hữu cấu trúc kiến trúc độc nhất vô nhị ở châu Á: ngôi liên hoa đài bằng gỗ lim dựng trên một cột đá tròn đường kính 1.2m giữa hồ sen hình vuông. Tượng trưng cho sự thanh tịnh, trường tồn và lòng từ bi của đạo Phật.',
    architecturalHighlights: [
      'Cột đá đơn nguyên khối đỡ toàn bộ đài sen Liên Hoa',
      'Hệ mái đao cong vút chạm trổ hình rồng thời Lý mềm mại',
      'Hồ sen Linh Chiểu vuông vức bao quanh theo thuyết Trời tròn Đất vuông',
      'Tượng Phật Bà Quan Âm Bồ Tát tọa thiền sơn son thếp vàng'
    ],
    tipsForVisitors: 'Nên ghé thăm vào sáng sớm (7h30 - 9h00) để cảm nhận trọn vẹn hương sen sớm và không gian thanh tịnh không tiếng ồn.'
  },
  {
    id: 'heritage-2',
    title: 'Văn Miếu - Quốc Tử Giám',
    subtitle: 'Trường đại học đầu tiên & biểu tượng hiếu học Đại Việt',
    category: 'heritage',
    imageUrl: '/src/assets/images/temple_of_literature_1793939013104.jpg',
    distanceMeters: 480,
    bearingDegrees: 135.2,
    hasAudioTour: true,
    audioDurationMinutes: 6.2,
    audioNarrationText: 'Văn Miếu được xây dựng vào tháng 8 năm 1070 dưới thời vua Lý Thánh Tông để thờ Khổng Tử và các bậc hiền triết Nho gia. Đến năm 1076, vua Lý Nhân Tông cho lập Quốc Tử Giám bên cạnh, trở thành trường đại học đầu tiên của Việt Nam đào tạo hàng ngàn nhân tài cho đất nước suốt hơn 7 thế kỷ.',
    yearBuilt: 'Năm 1070 & 1076',
    era: 'Thời Lý - Trần - Hậu Lê',
    address: '58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
    coordinates: {
      lat: 21.0293,
      lng: 105.8360,
    },
    description: 'Quần thể Văn Miếu gồm 5 lớp sân ngăn cách bởi các cổng cổ kính, nổi bật với gác Khuê Văn Các bằng gỗ lợp ngói mũi hài, giếng Thiên Quang phản chiếu bóng cây cổ thụ và 82 tấm Bia Tiến sĩ vinh danh trí thức Đại Việt được UNESCO công nhận là Di sản Tư liệu Thế giới.',
    architecturalHighlights: [
      'Gác Khuê Văn Các với bốn cửa sổ tròn đón ánh sáng sao Khuê',
      '82 tấm bia Tiến sĩ cưỡi trên lưng rùa đá xanh nguyên khối',
      'Hồ Thiên Quang Tỉnh hội tụ tinh hoa đất trời',
      'Đại Thành Điện uy nghiêm với đôi hạc ngự lưng quy'
    ],
    tipsForVisitors: 'Hãy đi dọc vườn bia Tiến sĩ để chiêm ngưỡng nghệ thuật chạm khắc hoa văn rồng mây của thế kỷ 15 - 18.'
  },
  {
    id: 'heritage-3',
    title: 'Tháp Rùa - Hồ Hoàn Kiếm',
    subtitle: 'Trái tim di sản nghìn năm và huyền tích gươm thần Thuận Thiên',
    category: 'heritage',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    distanceMeters: 750,
    bearingDegrees: 205.4,
    hasAudioTour: true,
    audioDurationMinutes: 5.0,
    audioNarrationText: 'Hồ Hoàn Kiếm, hay còn gọi là Hồ Gươm, gắn liền với truyền thuyết vua Lê Lợi trả gươm báu Thuận Thiên cho Rùa Vàng sau khi đánh đuổi giặc Minh. Giữa lòng hồ xanh biếc quanh năm là Tháp Rùa cổ kính, cây cầu Thê Húc đỏ son dẫn vào Đền Ngọc Sơn và tháp Bút viết lên trời xanh.',
    yearBuilt: 'Năm 1886 (Tháp Rùa)',
    era: 'Lịch sử Hậu Lê & Cận đại',
    address: 'Trung tâm quận Hoàn Kiếm, Hà Nội',
    coordinates: {
      lat: 21.0287,
      lng: 105.8524,
    },
    description: 'Tháp Rùa nằm trên một gò đảo nhỏ giữa hồ Hoàn Kiếm, pha trộn nét kiến trúc Gothic châu Âu với phần mái ngói truyền thống Á Đông. Nơi đây là điểm hẹn lịch sử văn hóa linh thiêng của người dân Thủ đô.',
    architecturalHighlights: [
      'Cầu Thê Húc cong cong như dải lụa đỏ dẫn lối thanh tao',
      'Đài Nghiên và Tháp Bút tả thanh thiên uy phong',
      'Bóng liễu rủ và làn nước xanh lục thủy đặc trưng quanh năm'
    ],
    tipsForVisitors: 'Thời điểm ngắm đẹp nhất là hoàng hôn khi đèn hoa đăng và ánh đèn vàng rực rỡ soi bóng xuống mặt hồ.'
  },
  {
    id: 'heritage-4',
    title: 'Hoàng Thành Thăng Long',
    subtitle: 'Trung tâm quyền lực hoàng gia Đại Việt suốt 13 thế kỷ',
    category: 'heritage',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    distanceMeters: 890,
    bearingDegrees: 340.1,
    hasAudioTour: true,
    audioDurationMinutes: 7.0,
    audioNarrationText: 'Khu trung tâm Hoàng thành Thăng Long là Di sản Văn hóa Thế giới được UNESCO vinh danh năm 2010. Nơi đây từng là nơi thiết triều, sinh hoạt của các triều đại Lý, Trần, Lê, Mạc, Nguyễn với các tầng địa tầng khảo cổ học vô giá còn nguyên vẹn.',
    yearBuilt: 'Năm 1010',
    era: 'Thời Lý - Trần - Lê - Nguyễn',
    address: '19C Hoàng Diệu, Quán Thánh, Ba Đình, Hà Nội',
    coordinates: {
      lat: 21.0375,
      lng: 105.8402,
    },
    description: 'Khu di tích bao gồm Cột cờ Hà Nội kỳ vĩ, cổng Đoan Môn đồ sộ với 5 vòm cuốn, thềm rồng Điện Kính Thiên thời Lê sơ và di tích khảo cổ 18 Hoàng Diệu với hàng triệu hiện vật gốm sứ quý tộc.',
    architecturalHighlights: [
      'Cổng Đoan Môn gạch vồ xám với lối đi hoàng gia chính giữa',
      'Đôi rồng đá điện Kính Thiên thế kỷ 15 tuyệt mỹ',
      'Hệ thống tầng địa tầng văn hóa chồng lớp suốt 1.300 năm'
    ],
    tipsForVisitors: 'Đừng bỏ lỡ trải nghiệm Tour đêm Hoàng Thành Thăng Long để bước chân vào không gian cung đình xưa lung linh ánh đuốc.'
  }
];

export const CULINARY_DISCOVERIES: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Phở Bò Gia Truyền Bát Đàn',
    specialtyName: 'Phở bò tái lăn nước dùng niêu hầm 14 tiếng',
    category: 'food',
    imageUrl: '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    distanceMeters: 180,
    bearingDegrees: 45.3,
    spiceRating: 1,
    spiceLabel: 'Cay nhẹ ấm nồng',
    flavorTags: ['Gia truyền', 'Nước dùng trong veo', 'Thịt bò tươi', 'Quẩy giòn rụm'],
    priceRange: '55.000đ - 75.000đ',
    address: '49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội',
    coordinates: {
      lat: 21.0337,
      lng: 105.8465,
    },
    heritageStory: 'Quán phở Bát Đàn đã lưu giữ hương vị phở phố cổ suốt hơn 7 thập kỷ. Điểm đặc biệt là nước dùng ninh hoàn toàn từ xương ống bò tươi cùng quế, hồi, thảo quả nướng cháy xém, không bột ngọt công nghiệp, thơm ngọt thanh tự nhiên.',
    recommendedDishes: ['Phở tái nạm gầu giòn', 'Phở tái lăn xào lăn lửa lớn', 'Quẩy nóng vàng ươm', 'Trứng gà chần lòng đào'],
    mustTryTip: 'Hãy đến trước 8h sáng để thưởng thức bát phở nóng hổi khi nước dùng vừa đạt độ sánh ngọt hoàn hảo nhất trong ngày.'
  },
  {
    id: 'food-2',
    name: 'Chả Cá Lã Vọng Phố Cổ',
    specialtyName: 'Cá lăng nướng than hoa om thì là chảo đồng',
    category: 'food',
    imageUrl: '/src/assets/images/cha_ca_la_vong_1793939014472.jpg',
    distanceMeters: 310,
    bearingDegrees: 110.8,
    spiceRating: 2,
    spiceLabel: 'Đậm đà mắm tôm',
    flavorTags: ['Đặc sản kinh kỳ', 'Cá lăng sông Hồng', 'Mắm tôm chanh sủi bọt', 'Hương thì là nồng nàn'],
    priceRange: '130.000đ - 180.000đ',
    address: '14 Chả Cá, Hàng Bồ, Hoàn Kiếm, Hà Nội',
    coordinates: {
      lat: 21.0354,
      lng: 105.8488,
    },
    heritageStory: 'Khởi nguồn từ năm 1871 bởi gia tộc họ Đoàn. Từng miếng cá lăng được lọc phi lê dày, tẩm ướp nghệ, riềng, mẻ, mắm tôm rồi kẹp thanh tre nướng than hoa thơm lừng, sau đó đảo đều trên chảo gang với thì là và đầu hành hoa trắng giòn.',
    recommendedDishes: ['Chảo chả cá lăng truyền thống', 'Bún rối làng Phú Đô', 'Lạc rang giòn thơm', 'Mắm tôm Thanh Hóa đánh bông bọt'],
    mustTryTip: 'Gắp một miếng cá vàng ươm, kèm nhánh thì là xào chín tới, rắc lạc rang và chấm vào chén mắm tôm chua cay bùng nổ vị giác.'
  },
  {
    id: 'food-3',
    name: 'Bún Chả Hàng Quạt',
    specialtyName: 'Chả viên nướng nan tre cháy cạnh thơm lừng ngõ nhỏ',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80',
    distanceMeters: 420,
    bearingDegrees: 280.5,
    spiceRating: 1,
    spiceLabel: 'Chua ngọt thanh tao',
    flavorTags: ['Ngõ nhỏ phố cổ', 'Nướng than hoa', 'Nước mắm gia truyền', 'Dưa góp giòn sần sật'],
    priceRange: '45.000đ - 60.000đ',
    address: 'Ngõ 74 Hàng Quạt, Hàng Gai, Hoàn Kiếm, Hà Nội',
    coordinates: {
      lat: 21.0321,
      lng: 105.8496,
    },
    heritageStory: 'Nằm ẩn mình trong con ngõ sâu đặc trưng phố cổ, quán bún chả Hàng Quạt nức tiếng nhờ chả viên băm từ thịt nạc dăm ướp hành hoa, nướng trên vỉ nan hoa tỏa khói thơm ngào ngạt khắp con phố.',
    recommendedDishes: ['Suất bún chả viên lẫn chả miếng', 'Nem cua bể vỏ giòn tan', 'Rau sống ngắt tỉ mỉ'],
    mustTryTip: 'Thêm chút ớt tươi băm và tỏi ngâm dấm để nước chấm cân bằng vị chua, cay, mặn, ngọt tinh tế.'
  },
  {
    id: 'food-4',
    name: 'Cà Phê Trứng Giảng',
    specialtyName: 'Hương vị cà phê kem trứng béo ngậy sáng tạo năm 1946',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    distanceMeters: 550,
    bearingDegrees: 85.0,
    spiceRating: 0,
    spiceLabel: 'Béo ngọt thơm cà phê',
    flavorTags: ['Huyền thoại 1946', 'Lòng đỏ trứng đánh bông', 'Cà phê Robusta đậm đặc', 'Ngồi cốc nước ấm'],
    priceRange: '35.000đ - 50.000đ',
    address: '39 Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
    coordinates: {
      lat: 21.0339,
      lng: 105.8540,
    },
    heritageStory: 'Do cụ Nguyễn Văn Giảng, nguyên bartender tại khách sạn 5 sao Metropole sáng tạo vào năm 1946 trong thời kỳ thiếu sữa tươi. Cụ đã dùng lòng đỏ trứng gà đánh bông với mật ong và bơ để tạo nên lớp kem bọt mịn màng phủ lên tách cà phê phin đậm đặc.',
    recommendedDishes: ['Cà phê trứng nóng nguyên bản', 'Cà phê trứng đá mát lạnh', 'Ca cao trứng ngọt ngào', 'Trứng đánh kem đậu xanh'],
    mustTryTip: 'Dùng thìa con nếm lớp kem trứng mịn màng trước, sau đó khuấy nhẹ từ đáy cốc để hòa quyện vị đắng của cà phê với vị béo ngậy ngọt ngào.'
  }
];

export const AR_CAMERA_BACKGROUND = '/src/assets/images/ar_hanoi_view_1793939014182.jpg';
