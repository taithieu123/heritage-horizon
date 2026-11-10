-- ============================================================================
-- CƠ SỞ DỮ LIỆU TINH GỌN CHO MYSQL WORKBENCH (HERITAGE & HORIZON)
-- PHIÊN BẢN RÚT GỌN: GỘP CỘT VỊ TRÍ, BẢNG NGẮN GỌN, DỄ QUẢN LÝ
-- ENCODING: utf8mb4_unicode_ci (Hỗ trợ 100% tiếng Việt)
-- ============================================================================

DROP DATABASE IF EXISTS `heritage_horizon_db`;
CREATE DATABASE IF NOT EXISTS `heritage_horizon_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `heritage_horizon_db`;

-- ----------------------------------------------------------------------------
-- 1. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (Rút gọn)
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `role` VARCHAR(50) NOT NULL DEFAULT 'Admin' COMMENT 'Super Admin, Auditor, AR Coordinator',
    `status` VARCHAR(20) DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. BẢNG DI TÍCH & ĐỊA DANH (Gộp toàn bộ vị trí & tọa độ vào 1 CỘT LOCATION)
-- ----------------------------------------------------------------------------
CREATE TABLE `heritage_landmarks` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã di tích: DT-HN-00104',
    `name` VARCHAR(200) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'Lịch sử' COMMENT 'Lịch sử, Kiến trúc, Danh thắng',
    `badge` VARCHAR(20) DEFAULT 'QG-ĐB' COMMENT 'QG-ĐB, UNESCO, DT-LS',
    
    -- GỘP 1 CỘT VỊ TRÍ DUY NHẤT: Địa chỉ, Kinh độ, Vĩ độ chuẩn WGS84
    `location` VARCHAR(255) NOT NULL COMMENT 'Ví dụ: Phố Chùa Một Cột, Ba Đình | 21.0359, 105.8336',
    
    -- Gộp thông số AR
    `ar_heading` DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Góc la bàn AR (0-360 độ)',
    `has_3d_mesh` BOOLEAN DEFAULT TRUE,
    `rating` DECIMAL(3, 2) DEFAULT 4.9,
    `image_url` VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. BẢNG MÓN ĂN & CẢNH BÁO DỊ ỨNG FR08 (Rút gọn)
-- ----------------------------------------------------------------------------
CREATE TABLE `culinary_items` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'DS-AMTHUC-014',
    `name` VARCHAR(200) NOT NULL,
    `origin_region` VARCHAR(150) NOT NULL COMMENT 'Hà Nội, Nam Định, Sài Gòn...',
    
    -- Gộp toàn bộ nhãn dị ứng FR08 vào 1 cột
    `allergens_fr08` VARCHAR(255) DEFAULT 'Không Gluten' COMMENT 'Chứa mắm tôm, Đậu phộng, Thịt lợn...',
    
    `price_range` VARCHAR(100) DEFAULT '50.000 - 80.000 đ',
    `total_restaurants` INT DEFAULT 1,
    `image_url` VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. BẢNG NHÃN CẢNH BÁO DỊ ỨNG QUỐC TẾ FR08 (allergen_labels)
-- ----------------------------------------------------------------------------
CREATE TABLE `allergen_labels` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'FR08-ALG-01',
    `name` VARCHAR(150) NOT NULL COMMENT 'Mắm tôm, Lạc rang, Gluten...',
    `risk_level` VARCHAR(20) NOT NULL DEFAULT 'warning' COMMENT 'danger, warning, safe, info',
    `symptoms_desc` VARCHAR(255) NOT NULL COMMENT 'Triệu chứng dị ứng & khuyến nghị',
    `common_in_dishes` VARCHAR(255) NOT NULL COMMENT 'Món ăn thường gặp',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BẢNG QUÁN ĂN & THẨM ĐỊNH (Gộp toàn bộ vị trí & tọa độ vào 1 CỘT LOCATION)
-- ----------------------------------------------------------------------------
CREATE TABLE `restaurants` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'HN-BC-092',
    `name` VARCHAR(200) NOT NULL,
    `owner_name` VARCHAR(150) NOT NULL,
    `specialty_dish` VARCHAR(200) NOT NULL COMMENT 'Món đặc sản đăng ký',
    `location` VARCHAR(255) NOT NULL COMMENT 'Ví dụ: 24 Lê Văn Hưu, Hoàn Kiếm | 21.0189, 105.8532 (±1.1m)',
    `verification_status` VARCHAR(50) DEFAULT 'Pending' COMMENT 'Verified, Pending, Need Inspection',
    `safety_license` VARCHAR(100) DEFAULT 'GP ATTP số 482'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BẢNG HỒ SƠ THẨM ĐỊNH KHẨN CẤP (urgent_verification_tasks)
-- ----------------------------------------------------------------------------
CREATE TABLE `urgent_verification_tasks` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `dish_name` VARCHAR(200) NOT NULL,
    `coords` VARCHAR(100) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending, verified, rejected',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. BẢNG CẢNH BÁO HIỆU CHUẨN AR KHÔNG GIAN (calibration_alerts)
-- ----------------------------------------------------------------------------
CREATE TABLE `calibration_alerts` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `landmark_name` VARCHAR(200) NOT NULL,
    `viewport_desc` TEXT NOT NULL,
    `error_desc` VARCHAR(100) NOT NULL,
    `error_delta` VARCHAR(50) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `reported_by_users` INT DEFAULT 1,
    `action_text` VARCHAR(100) NOT NULL,
    `resolved` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. BẢNG NHẬT KÝ HOẠT ĐỘNG QUẢN TRỊ (admin_activity_logs)
-- ----------------------------------------------------------------------------
CREATE TABLE `admin_activity_logs` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `user_name` VARCHAR(150) NOT NULL,
    `user_role` VARCHAR(100) NOT NULL,
    `time_ago` VARCHAR(50) NOT NULL,
    `action_desc` TEXT NOT NULL,
    `tags` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. BẢNG CHỈ SỐ THỐNG KÊ HỆ THỐNG (system_overview_stats)
-- ----------------------------------------------------------------------------
CREATE TABLE `system_overview_stats` (
    `metric_key` VARCHAR(50) NOT NULL PRIMARY KEY,
    `metric_value` DECIMAL(12, 2) NOT NULL,
    `metric_label` VARCHAR(150) NOT NULL,
    `growth_percent` DECIMAL(5, 2) DEFAULT 0.00,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DỮ LIỆU THỰC TẾ ĐỒNG BỘ 100% VỚI HỆ THỐNG WEB & APP (HERITAGE & HORIZON)
-- ============================================================================

-- 1. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN
INSERT INTO `users` (`id`, `full_name`, `email`, `role`, `status`) VALUES
('user-1', 'Minh Quân', 'minhquan.admin@heritage.vn', 'Super Admin', 'Active'),
('user-2', 'Thanh Hương', 'thanhhuong.auditor@heritage.vn', 'Thẩm định viên', 'Active'),
('user-3', 'Hoàng Nam', 'hoangnam.ar@heritage.vn', 'Điều phối viên AR', 'Active'),
('user-4', 'Trần Quốc Toản', 'quoctoan.inspector@heritage.vn', 'Thanh tra thực địa', 'Active'),
('user-5', 'Vũ Minh Trang', 'minhtrang.content@heritage.vn', 'Biên tập viên di sản', 'Active');

-- 2. BẢNG DI TÍCH & ĐỊA DANH (Gộp 1 cột vị trí: Địa chỉ | Tọa độ WGS84)
INSERT INTO `heritage_landmarks` (`id`, `code`, `name`, `category`, `badge`, `location`, `ar_heading`, `rating`, `image_url`) VALUES
('lm-1', 'DT-HN-00104', 'Chùa Một Cột', 'Lịch sử', 'QG-ĐB', 'Phố Chùa Một Cột, Đội Cấn, Ba Đình | 21.0359, 105.8336', 142.40, 4.90, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),
('lm-2', 'DT-HN-00002', 'Hoàng Thành Thăng Long', 'Lịch sử', 'UNESCO', '19C Hoàng Diệu, Điện Biên, Ba Đình | 21.0344, 105.8407', 89.20, 4.80, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'),
('lm-3', 'DT-HN-00018', 'Văn Miếu - Quốc Tử Giám', 'Kiến trúc', 'QG-ĐB', '58 Quốc Tử Giám, Văn Miếu, Đống Đa | 21.0285, 105.8355', 180.00, 4.90, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
('lm-4', 'DT-HN-00007', 'Tháp Rùa - Hồ Hoàn Kiếm', 'Danh thắng', 'DT-LS', 'Hồ Gươm, Hàng Trống, Hoàn Kiếm | 21.0287, 105.8524', 56.90, 4.70, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80'),
('lm-5', 'DT-HN-00045', 'Di tích Lịch sử Nhà Tù Hỏa Lò', 'Lịch sử', 'QG-ĐB', '1 Hỏa Lò, Trần Hưng Đạo, Hoàn Kiếm | 21.0253, 105.8465', 215.00, 4.90, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'),
('lm-6', 'DT-HN-00089', 'Nhà Thờ Lớn Hà Nội', 'Kiến trúc', 'DT-LS', '40 Nhà Chung, Hàng Trống, Hoàn Kiếm | 21.0305, 105.8496', 75.30, 4.80, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
('lm-7', 'DT-SG-00001', 'Chợ Bến Thành', 'Lịch sử', 'DT-LS', 'Đường Lê Lợi, Phường Bến Thành, Quận 1 | 10.7725, 106.6980', 195.00, 4.80, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80'),
('lm-8', 'DT-SG-00002', 'Dinh Độc Lập (Hội trường Thống Nhất)', 'Lịch sử', 'QG-ĐB', '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1 | 10.7770, 106.6954', 310.50, 4.90, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');

-- 3. BẢNG MÓN ĂN & CẢNH BÁO DỊ ỨNG FR08 (Gộp nhãn cảnh báo)
INSERT INTO `culinary_items` (`id`, `code`, `name`, `origin_region`, `allergens_fr08`, `price_range`, `total_restaurants`) VALUES
('dish-1', 'DS-AMTHUC-014', 'Bún Chả Hà Nội', 'Hà Nội (Kinh Kỳ)', 'Thịt lợn, Nước mắm cá, Không Gluten (GF)', '50.000 - 80.000 đ', 342),
('dish-2', 'DS-AMTHUC-001', 'Phở Bò Khói Hôi (Gia Truyền)', 'Nam Định / Hà Nội Cổ', 'Thịt bò, Không Gluten (Bánh gạo), Hồi • Quế', '55.000 - 95.000 đ', 512),
('dish-3', 'DS-AMTHUC-003', 'Chả Cá Lã Vọng', 'Phố Cổ Hoàn Kiếm (Năm 1871)', 'Chứa mắm tôm, Lạc rang (Đậu phộng), Cá da trơn', '150.000 - 220.000 đ', 88),
('dish-4', 'DS-AMTHUC-008', 'Bún Ốc Nguội Phố Cổ', 'Tây Hồ - Ô Quan Chưởng', 'Thân mềm (Ốc/Sò), Giấm bỗng, Không Gluten', '40.000 - 65.000 đ', 45),
('dish-5', 'DS-AMTHUC-021', 'Bánh Cuốn Tráng Tay Mộc Nhĩ', 'Thanh Trì - Hà Nội', 'Bột gạo, Nước mắm cá, Không Gluten, Thịt lợn', '35.000 - 55.000 đ', 164),
('dish-6', 'DS-AMTHUC-035', 'Xôi Xéo Lá Sen Mỡ Hành', 'Làng Tương Mai, Thăng Long', 'Gạo nếp cái hoa vàng, Đậu xanh, Mỡ lợn', '20.000 - 45.000 đ', 218),
('dish-7', 'DS-AMTHUC-042', 'Cơm Tấm Sườn Bì Chả Trứng', 'Sài Gòn - Chợ Lớn', 'Thịt heo nướng, Nước mắm kẹo, Trứng gà', '45.000 - 85.000 đ', 620),
('dish-8', 'DS-AMTHUC-050', 'Bánh Mì Thập Cẩm Patê Bơ Pháp', 'Sài Gòn / Hà Nội', 'Chứa Gluten (Bột mì), Patê gan heo, Bơ sữa', '30.000 - 65.000 đ', 850);

-- 4. BẢNG NHÃN CẢNH BÁO DỊ ỨNG QUỐC TẾ FR08 (allergen_labels)
INSERT INTO `allergen_labels` (`id`, `code`, `name`, `risk_level`, `symptoms_desc`, `common_in_dishes`) VALUES
('alg-1', 'FR08-ALG-01', 'Mắm tôm / Mắm tép / Mắm ruốc', 'danger', 'Chứa đạm giáp xác lên men, dị ứng histamin cao, ngứa cổ & nổi mề đay', 'Bún đậu mắm tôm, Chả cá Lã Vọng, Bún thang, Bún riêu'),
('alg-2', 'FR08-ALG-02', 'Lạc rang / Đậu phộng', 'danger', 'Gây dị ứng protein lạc nghiêm trọng, có nguy cơ sốc phản vệ cao', 'Nộm bò khô, Chả cá Lã Vọng, Xôi xéo, Gỏi cuốn Sài Gòn'),
('alg-3', 'FR08-ALG-03', 'Thân mềm (Ốc bươu / Sò huyết / Hến)', 'danger', 'Dị nguyên nhóm nhuyễn thể Mollusca, khó tiêu hóa đối với cơ địa nhạy cảm', 'Bún ốc nguội phố cổ, Canh hến xứ Huế, Ốc nấu chuối đậu'),
('alg-4', 'FR08-ALG-04', 'Thịt lợn / Mỡ lợn phi', 'warning', 'Cần lưu ý cho du khách theo chế độ ăn kiêng tôn giáo (Halal/Kosher) hoặc thuần chay', 'Bún chả nướng than hoa, Xôi xéo mỡ hành, Bánh cuốn nhân thịt'),
('alg-5', 'FR08-ALG-05', 'Không chứa Gluten (Gluten-Free GF)', 'safe', 'Thành phần hoàn toàn từ bột gạo truyền thống hoặc đỗ xanh, an toàn tuyệt đối với người bệnh Celiac', 'Phở bò truyền thống, Bánh cuốn tráng tay, Bún tươi sợi tròn'),
('alg-6', 'FR08-ALG-06', 'Quế chi • Hoa hồi • Thảo quả', 'warning', 'Gia vị thảo mộc cay nồng tự nhiên, người có cơ địa kích ứng niêm mạc cần giảm lượng dùng', 'Nước dùng Phở bò gia truyền 24h, Bò sốt vang, Bò kho'),
('alg-7', 'FR08-ALG-07', 'Trứng gia cầm (Gà / Vịt)', 'warning', 'Dị ứng protein lòng trắng Ovalbumin, phát ban ngoài da nhẹ', 'Cơm tấm chả trứng hấp, Bánh mì kẹp trứng ốp la, Bún thang thái chỉ'),
('alg-8', 'FR08-ALG-08', 'Cá da trơn (Cá lăng / Cá quả / Cá tra)', 'warning', 'Dị nguyên Parvalbumin từ cá nước ngọt và cá da trơn béo', 'Chả cá Lã Vọng xèo xèo, Canh chua cá lăng, Bún cá rô đồng'),
('alg-9', 'FR08-ALG-09', 'Bơ sữa động vật & Patê gan', 'danger', 'Chứa lactose động vật và purin nội tạng, người bất dung nạp đường sữa cần tránh', 'Bánh mì Sài Gòn thập cẩm, Bánh mì chảo patê cột điện'),
('alg-10', 'FR08-ALG-10', 'Tôm khô / Tép giòn nước ngọt', 'danger', 'Dị ứng Tropomyosin trong giáp xác, sưng môi mắt khi ăn lượng nhiều', 'Bún riêu cua đồng tóp mỡ, Nước mắm chua ngọt chấm bánh bèo');

-- 5. BẢNG QUÁN ĂN & THẨM ĐỊNH XÁC MINH (Gộp địa chỉ & tọa độ GPS)
INSERT INTO `restaurants` (`id`, `code`, `name`, `owner_name`, `specialty_dish`, `location`, `verification_status`, `safety_license`) VALUES
('res-1', 'HN-BC-092', 'Bún Chả Hương Liên', 'Nguyễn Thị Liên', 'Bún chả Hà Nội (Nem cua bể, Thịt nướng than hoa)', '24 Lê Văn Hưu, Hoàn Kiếm | 21.0189, 105.8532', 'Pending', 'GP ATTP số 482/2023/ATTP-HN'),
('res-2', 'HN-HQ-011', 'Bún Chả Hàng Quạt', 'Bùi Văn Quý', 'Bún chả gia truyền (Chả nướng nan tre lá lốt)', 'Ngõ 74 Hàng Quạt, Hoàn Kiếm | 21.0331, 105.8504', 'Need Inspection', 'GP ATTP số 112/2022/ATTP-HN'),
('res-3', 'HN-PT-001', 'Phở Thìn Bờ Hồ', 'Bùi Thị Thìn', 'Phở bò tái chín (Gia truyền từ năm 1955)', '61 Đinh Tiên Hoàng, Hoàn Kiếm | 21.0315, 105.8524', 'Verified', 'GP ATTP số 005/2021/ATTP-HN'),
('res-4', 'HN-CC-034', 'Chả Cá Thăng Long', 'Nguyễn Phúc Anh', 'Chả cá lăng di sản (Gia vị thì là mắm tôm)', '19 Đường Thành, Hoàn Kiếm | 21.0326, 105.8459', 'Verified', 'GP ATTP số 230/2023/ATTP-HN'),
('res-5', 'HN-BD-015', 'Phở Gia Truyền Bát Đàn', 'Nguyễn Trung Kiên', 'Phở bò tái lăn niêu đất 14 tiếng', '49 Bát Đàn, Cửa Đông, Hoàn Kiếm | 21.0337, 105.8465', 'Verified', 'GP ATTP số 319/2022/ATTP-HN'),
('res-6', 'HN-BH-008', 'Bánh Cuốn Bà Hoành', 'Trần Bích Hoành', 'Bánh cuốn tráng tay mộc nhĩ chả quế giòn', '66 Tô Hiến Thành, Hai Bà Trưng | 21.0142, 105.8508', 'Verified', 'GP ATTP số 104/2023/ATTP-HN'),
('res-7', 'SG-BG-001', 'Cơm Tấm Ba Ghiền', 'Trương Vĩnh Phúc', 'Cơm tấm sườn nướng mật ong khổng lồ', '84 Đặng Văn Ngữ, Phú Nhuận, TP.HCM | 10.7932, 106.6715', 'Verified', 'GP ATTP số 678/2023/ATTP-HCM'),
('res-8', 'SG-HH-022', 'Bánh Mì Huỳnh Hoa', 'Huỳnh Thị Hoa', 'Bánh mì ô môi patê bơ sốt đặc biệt', '26 Lê Thị Riêng, Quận 1, TP.HCM | 10.7712, 106.6924', 'Pending', 'GP ATTP số 912/2023/ATTP-HCM');

-- 5. BẢNG HỒ SƠ THẨM ĐỊNH KHẨN CẤP (urgent_verification_tasks)
INSERT INTO `urgent_verification_tasks` (`id`, `name`, `address`, `dish_name`, `coords`, `status`) VALUES
('task-1', 'Bún Chả Cửa Đông', '41 Cửa Đông, Hoàn Kiếm, HN', 'Bún chả que tre than hoa', '21.0331° N, 105.8450° E', 'pending'),
('task-2', 'Bánh Cuốn Bà Hoành', '66 Tô Hiến Thành, Hai Bà Trưng, HN', 'Bánh cuốn chả quế tráng tay', '21.0152° N, 105.8504° E', 'verified'),
('task-3', 'Chả Cá Lã Vọng Đoàn Thị Điểm', '19 Đoàn Thị Điểm, Đống Đa, HN', 'Chả cá lăng cổ truyền', '21.0256° N, 105.8312° E', 'pending'),
('task-4', 'Cốm Mộc Làng Vòng Bà Ánh', 'Dịch Vọng Hậu, Cầu Giấy, HN', 'Cốm tươi non bọc lá sen', '21.0368° N, 105.7876° E', 'pending'),
('task-5', 'Phở Gia Truyền Bát Đàn', '49 Bát Đàn, Hoàn Kiếm, HN', 'Phở bò tái nạm gầu giòn', '21.0337° N, 105.8471° E', 'verified');

-- 6. BẢNG CẢNH BÁO HIỆU CHUẨN AR KHÔNG GIAN (calibration_alerts)
INSERT INTO `calibration_alerts` (`id`, `landmark_name`, `viewport_desc`, `error_desc`, `error_delta`, `reason`, `reported_by_users`, `action_text`, `resolved`) VALUES
('calib-1', 'Đền Ngọc Sơn (Tháp Rùa Viewport)', 'La bàn số trên thiết bị ghi nhận nhiều từ trường khi du khách đứng gần cầu Thê Húc.', 'Lệch', '+4.2m', 'Nhiễu từ trường cầu Thê Húc', 18, 'Hiệu chuẩn lại Mesh 3D', FALSE),
('calib-2', 'Ô Quan Chưởng (Cổng Vòm Cổ)', 'Điểm neo thực tế ảo (AR Anchor) bị bóng che trong điều kiện ánh sáng lúc hoàng hôn.', 'Anchor trôi', '1.8m', 'Độ tương phản ánh sáng thấp lúc chiều tà', 7, 'Cập nhật Keypoint Visual', FALSE),
('calib-3', 'Cột Cờ Hà Nội (Kỳ Đài)', 'Cần đồng bộ lại phương vị góc ngắm AR la bàn 142.4° SE để tránh chồng lấn đường chân trời.', 'Lệch la bàn', '2.1°', 'Độ trễ cảm biến từ trường khi xoay máy', 12, 'Cân chỉnh Gyroscope', FALSE);

-- 7. BẢNG NHẬT KÝ HOẠT ĐỘNG QUẢN TRỊ (admin_activity_logs)
INSERT INTO `admin_activity_logs` (`id`, `user_name`, `user_role`, `time_ago`, `action_desc`, `tags`) VALUES
('log-1', 'Minh Quân', 'Super Admin', '10 phút trước', 'Đã tải lên và gắn thẻ không gian mô hình 3D AR mới: Chùa Một Cột (Diên Hựu Tự)', 'GLTF 24.8MB, LOD 4'),
('log-2', 'Thanh Hương', 'Thẩm định viên', '35 phút trước', 'Đã phê duyệt hồ sơ địa điểm & công thức đặc sản: Bún Chả Hương Liên (Lê Văn Hưu). Gắn huy hiệu Di sản Ẩm thực.', 'Tích xanh AR, RTK ±1.1m'),
('log-3', 'Hệ thống Tự động', 'FR08 Guard', '1 giờ trước', 'Cập nhật bộ từ khóa cảnh báo dị ứng cho thành phần Mắm cáy & Mắm ruốc. Đồng bộ 12 quán ăn khu vực Hà Nội.', 'FR08 Level 4, 12 quán'),
('log-4', 'Hoàng Nam', 'Điều phối viên', '3 giờ trước', 'Cập nhật tọa độ Geofence bán kính 50m quanh Văn Miếu - Quốc Tử Giám.', 'Geofence 50m, AR Anchor'),
('log-5', 'Trần Quốc Toản', 'Thanh tra thực địa', '5 giờ trước', 'Kiểm tra đo đạc thực địa GPS RTK tại Phở Thìn Bờ Hồ, sai số đạt chuẩn ±0.8m.', 'GPS RTK, Kiểm định');

-- 8. BẢNG CHỈ SỐ THỐNG KÊ HỆ THỐNG (system_overview_stats)
INSERT INTO `system_overview_stats` (`metric_key`, `metric_value`, `metric_label`, `growth_percent`) VALUES
('landmarks_active', 8.00, 'Tổng di tích văn hóa đang hoạt động', 14.00),
('landmarks_3d', 8.00, 'Mô hình không gian 3D AR sẵn sàng', 25.00),
('culinary_dishes', 8.00, 'Món ăn di sản được chuẩn hóa FR08', 18.00),
('culinary_allergens', 10.00, 'Từ điển thành phần & dị ứng quốc tế', 12.00),
('restaurants_total', 8.00, 'Tổng số cơ sở ẩm thực trong hệ thống', 15.00),
('restaurants_verified', 6.00, 'Cơ sở ẩm thực đã cấp tích xanh', 88.50),
('ar_scans_total', 45820.00, 'Lượt quét ống ngắm AR Camera', 28.40),
('retention_rate', 82.00, 'Tỷ lệ du khách tương tác lại hàng tháng', 5.20);

-- ============================================================================
-- CÁC CÂU LỆNH TRUY VẤN MẪU PHỔ BIẾN
-- ============================================================================

-- Truy vấn 1: Lấy danh sách toàn bộ di tích xếp theo đánh giá giảm dần
SELECT `code`, `name`, `category`, `badge`, `location`, `ar_heading`, `rating`
FROM `heritage_landmarks`
ORDER BY `rating` DESC;

-- Truy vấn 2: Lấy các cơ sở ẩm thực đã được cấp tích xanh (Verified)
SELECT `name`, `owner_name`, `specialty_dish`, `location`, `safety_license`
FROM `restaurants`
WHERE `verification_status` = 'Verified';

-- Truy vấn 3: Xem các cảnh báo hiệu chuẩn không gian AR chưa xử lý
SELECT `landmark_name`, `error_desc`, `error_delta`, `reason`, `reported_by_users`
FROM `calibration_alerts`
WHERE `resolved` = FALSE;

-- Truy vấn 4: Xem nhật ký hoạt động quản trị gần nhất
SELECT `user_name`, `user_role`, `time_ago`, `action_desc`, `tags`
FROM `admin_activity_logs`
ORDER BY `created_at` DESC;
