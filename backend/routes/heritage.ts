import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const heritageRouter = Router();

// ==========================================
// 1. CANONICAL DATABASE API ENDPOINTS
// ==========================================

// GET /api/database/overview
heritageRouter.get('/database/overview', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.getOverviewStats(),
  });
});

// GET /api/database/landmarks
heritageRouter.get('/database/landmarks', (req: Request, res: Response) => {
  const { search } = req.query;
  const list = db.getLandmarks(typeof search === 'string' ? search : undefined);
  res.json({
    success: true,
    count: list.length,
    data: list,
  });
});

// POST /api/database/landmarks
heritageRouter.post('/database/landmarks', (req: Request, res: Response) => {
  const created = db.addLandmark(req.body);
  res.status(201).json({
    success: true,
    data: created,
  });
});

// GET /api/database/culinary
heritageRouter.get('/database/culinary', (req: Request, res: Response) => {
  const { search } = req.query;
  const list = db.getCulinaryItems(typeof search === 'string' ? search : undefined);
  res.json({
    success: true,
    count: list.length,
    data: list,
  });
});

// POST /api/database/culinary
heritageRouter.post('/database/culinary', (req: Request, res: Response) => {
  const created = db.addCulinaryItem(req.body);
  res.status(201).json({
    success: true,
    data: created,
  });
});

// GET /api/database/allergens
heritageRouter.get('/database/allergens', (req: Request, res: Response) => {
  const { search } = req.query;
  const list = db.getAllergens(typeof search === 'string' ? search : undefined);
  res.json({
    success: true,
    count: list.length,
    data: list,
  });
});

// POST /api/database/allergens
heritageRouter.post('/database/allergens', (req: Request, res: Response) => {
  const created = db.addAllergen(req.body);
  res.status(201).json({
    success: true,
    data: created,
  });
});

// GET /api/database/restaurants
heritageRouter.get('/database/restaurants', (req: Request, res: Response) => {
  const { search } = req.query;
  const list = db.getRestaurants(typeof search === 'string' ? search : undefined);
  res.json({
    success: true,
    count: list.length,
    data: list,
  });
});

// POST /api/database/restaurants/:id/verify
heritageRouter.post('/database/restaurants/:id/verify', (req: Request, res: Response) => {
  const updated = db.updateRestaurantStatus(req.params.id, 'Verified');
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy cơ sở quán ăn' });
  }
  res.json({
    success: true,
    message: 'Đã xác minh và cấp tích xanh thành công',
    data: updated,
  });
});

// GET /api/database/users
heritageRouter.get('/database/users', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.getUsers(),
  });
});

// POST /api/database/tasks/:id/verify
heritageRouter.post('/database/tasks/:id/verify', (req: Request, res: Response) => {
  const updated = db.updateUrgentTaskStatus(req.params.id, 'verified');
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy tác vụ' });
  }
  res.json({
    success: true,
    message: 'Đã duyệt hồ sơ thực địa thành công',
    data: updated,
  });
});

// POST /api/database/calibration-alerts/:id/resolve
heritageRouter.post('/database/calibration-alerts/:id/resolve', (req: Request, res: Response) => {
  const updated = db.resolveCalibrationAlert(req.params.id);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy cảnh báo hiệu chuẩn' });
  }
  res.json({
    success: true,
    message: 'Đã hoàn tất hiệu chuẩn không gian',
    data: updated,
  });
});

// GET /api/database/activity-logs
heritageRouter.get('/database/activity-logs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.getActivityLogs(),
  });
});

// ==========================================
// 2. MOBILE APP COMPATIBILITY ENDPOINTS
// ==========================================

// GET /api/heritage (maps landmarks to HeritageItem format)
heritageRouter.get('/heritage', (req: Request, res: Response) => {
  const { search } = req.query;
  const landmarks = db.getLandmarks(typeof search === 'string' ? search : undefined);

  const mapped = landmarks.map((l, i) => {
    let lat = 21.0337;
    let lng = 105.8465;
    if (l.location.includes('|')) {
      const parts = l.location.split('|')[1]?.trim()?.split(',');
      if (parts && parts.length >= 2) {
        lat = parseFloat(parts[0]) || 21.0337;
        lng = parseFloat(parts[1]) || 105.8465;
      }
    }

    const narrationMap: Record<string, string> = {
      'lm-1': 'Chào mừng bạn đến với Chùa Một Cột, hay Diên Hựu Tự, khởi dựng năm 1049 dưới triều vua Lý Thái Tông. Kiến trúc chùa mô phỏng đài sen nở trên hồ Linh Chiểu nâng đỡ bởi cột đá độc nhất vô nhị.',
      'lm-2': 'Hoàng Thành Thăng Long là Di sản Văn hóa Thế giới UNESCO, trung tâm quyền lực chính trị Đại Việt suốt 13 thế kỷ liên tiếp từ thời Lý, Trần, Lê sơ đến triều Nguyễn.',
      'lm-3': 'Văn Miếu - Quốc Tử Giám thành lập năm 1070, trường đại học đầu tiên của Việt Nam nơi lưu giữ 82 bia Tiến sĩ vinh danh truyền thống hiếu học ngàn năm.',
      'lm-4': 'Hồ Hoàn Kiếm và Tháp Rùa gắn liền với huyền tích vua Lê Lợi hoàn gươm báu Thuận Thiên cho Rùa Vàng sau thắng lợi chống quân Minh.',
      'lm-5': 'Nhà Tù Hỏa Lò (Maison Centrale) xây dựng từ thời Pháp thuộc năm 1896, nơi ghi dấu tinh thần kiên cường, bất khuất của các chiến sĩ cách mạng Việt Nam.',
      'lm-6': 'Nhà Thờ Lớn Hà Nội (St. Joseph Cathedral) khánh thành năm 1886 với phong cách kiến trúc Gothic phục hưng tuyệt mỹ giữa lòng phố cổ.',
      'lm-7': 'Chợ Bến Thành là biểu tượng giao thương sầm uất hơn 100 năm của Sài Gòn - TP.HCM với tháp đồng hồ 4 mặt trứ danh.',
      'lm-8': 'Dinh Độc Lập (Hội trường Thống Nhất) là Di tích Quốc gia Đặc biệt, chứng nhân lịch sử đánh dấu mốc non sông thống nhất ngày 30/4/1975.',
    };

    return {
      id: l.id,
      title: l.name,
      subtitle: `${l.category} • Xếp hạng ${l.badge}`,
      category: 'heritage' as const,
      imageUrl: l.image_url,
      distanceMeters: 220 + i * 180,
      bearingDegrees: l.ar_heading,
      hasAudioTour: l.has_audio,
      audioDurationMinutes: 4.5 + (i % 3),
      audioNarrationText: narrationMap[l.id] || `Di tích ${l.name} tọa lạc tại ${l.location}. Điểm đến văn hóa lịch sử hàng đầu Việt Nam.`,
      yearBuilt: l.category === 'Lịch sử' ? 'Khởi dựng lịch sử' : 'Kiến trúc cổ',
      era: l.badge,
      address: l.location.split('|')[0]?.trim() || l.location,
      coordinates: { lat, lng },
      description: `${l.name} là di tích văn hóa quốc gia được xếp hạng ${l.badge}, bảo tồn nguyên vẹn giá trị kiến trúc và tinh hoa dân tộc.`,
      architecturalHighlights: [
        'Mô hình 3D AR không gian chuẩn mm',
        'Tọa độ thực địa chuẩn hóa WGS84',
        'Định vị góc ngắm Camera la bàn thông minh',
        'Âm thanh thuyết minh đa ngữ chuẩn AI'
      ],
      tipsForVisitors: 'Bật ống ngắm AR để quét trực diện di tích và trải nghiệm lớp thông tin văn hóa tương tác 360 độ.',
    };
  });

  res.json({
    success: true,
    count: mapped.length,
    data: mapped,
  });
});

// GET /api/food (maps restaurants & culinary items to FoodItem format)
heritageRouter.get('/food', (_req: Request, res: Response) => {
  const restaurants = db.getRestaurants();

  const foodImages: Record<string, string> = {
    'res-1': '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    'res-2': '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    'res-3': '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    'res-4': '/src/assets/images/cha_ca_la_vong_1793939014472.jpg',
    'res-5': '/src/assets/images/pho_bat_dan_1793939013471.jpg',
    'res-6': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'res-7': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'res-8': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
  };

  const stories: Record<string, string> = {
    'res-1': 'Bún chả Hương Liên nổi danh với công thức chả quạt than hoa đượm khói, từng vinh dự đón Tổng thống Barack Obama thưởng thức năm 2016.',
    'res-2': 'Bún chả Hàng Quạt nép mình trong con ngõ phố cổ Hoàn Kiếm, chả nướng bằng nan tre tươi giữ trọn độ mọng nước và ngọt thơm tự nhiên.',
    'res-3': 'Phở Thìn Bờ Hồ mở từ năm 1955, nước dùng trong veo ngọt thanh hầm từ xương bò tươi suốt cả ngày, thịt bò thái mỏng chần tái mềm ngọt.',
    'res-4': 'Chả cá Thăng Long kế thừa tinh hoa nghề cá lăng áp chảo thì là, chấm mắm tôm đánh bông sủi bọt cùng chút rượu trắng và ớt tươi.',
    'res-5': 'Phở Bát Đàn hơn 70 năm gìn giữ nước phở bò tái lăn gia truyền, thực khách xếp hàng kiên nhẫn để thưởng thức hương vị nguyên bản.',
    'res-6': 'Bánh cuốn Bà Hoành tráng tay mỏng tang mịn màng, chấm nước mắm pha cà cuống và chả quế thơm lừng.',
    'res-7': 'Cơm tấm Ba Ghiền trứ danh Sài Gòn với miếng sườn nướng mật ong khổng lồ ướp đậm đà, hạt tấm tơi xốp ăn kèm chả trứng hấp thơm ngậy.',
    'res-8': 'Bánh mì Huỳnh Hoa là ổ bánh mì trứ danh đầy ắp nhân thịt nguội, giò thủ, chà bông và lớp patê bơ gia truyền béo ngậy.',
  };

  const mapped = restaurants.map((r, i) => {
    let lat = 21.0337;
    let lng = 105.8465;
    if (r.location.includes('|')) {
      const parts = r.location.split('|')[1]?.trim()?.split('(')[0]?.split(',');
      if (parts && parts.length >= 2) {
        lat = parseFloat(parts[0]) || 21.0337;
        lng = parseFloat(parts[1]) || 105.8465;
      }
    }

    const dishNameClean = r.specialty_dish.split('(')[0]?.trim() || r.specialty_dish;

    return {
      id: r.id,
      name: r.name,
      specialtyName: r.specialty_dish,
      category: 'food' as const,
      imageUrl: foodImages[r.id] || '/src/assets/images/pho_bat_dan_1793939013471.jpg',
      distanceMeters: 180 + i * 140,
      bearingDegrees: (45 + i * 45) % 360,
      spiceRating: i % 2 === 0 ? 1 : 2,
      spiceLabel: i % 2 === 0 ? 'Thanh ngọt dịu' : 'Đậm đà cay nhẹ',
      flavorTags: ['Gia truyền', 'Chuẩn vị địa phương', r.verification_status === 'Verified' ? 'Đã kiểm duyệt ATTP' : 'Chờ xác thực'],
      priceRange: '40.000 - 95.000 đ',
      address: r.location.split('|')[0]?.trim() || r.location,
      coordinates: { lat, lng },
      heritageStory: stories[r.id] || `Đặc sản ${dishNameClean} do nghệ nhân ẩm thực ${r.owner_name} kế thừa và gìn giữ theo tiêu chuẩn vệ sinh ATTP.`,
      recommendedDishes: [dishNameClean, 'Trà đá hoa nhài', 'Nem rán giòn', 'Quẩy nóng'],
      mustTryTip: 'Thưởng thức khi còn nóng hổi cùng rau thơm tươi và ớt tỏi ngâm giấm để cảm nhận đủ đầy phong vị ẩm thực.',
    };
  });

  res.json({
    success: true,
    count: mapped.length,
    data: mapped,
  });
});

// GET & POST /api/bookmarks
heritageRouter.get('/bookmarks', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getBookmarks() });
});

heritageRouter.post('/bookmarks/:id', (req: Request, res: Response) => {
  const isSaved = db.toggleBookmark(req.params.id);
  res.json({ success: true, targetId: req.params.id, isSaved });
});
