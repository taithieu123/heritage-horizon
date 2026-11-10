-- Database Schema for Heritage & Horizon Discovery
-- Compatible with PostgreSQL and SQLite

-- 1. Bảng Di tích Lịch sử & Kiến trúc (Heritage Landmarks)
CREATE TABLE IF NOT EXISTS heritage_landmarks (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500) NOT NULL,
    category VARCHAR(50) DEFAULT 'heritage',
    image_url TEXT NOT NULL,
    year_built VARCHAR(100),
    era VARCHAR(150),
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    bearing_degrees DECIMAL(5, 2) NOT NULL,
    distance_meters INT DEFAULT 250,
    has_audio_tour BOOLEAN DEFAULT TRUE,
    audio_duration_minutes DECIMAL(4, 2) DEFAULT 5.0,
    audio_narration_text TEXT,
    description TEXT,
    architectural_highlights JSON,
    tips_for_visitors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Ẩm thực Truyền thống & Quán Cổ (Culinary Discoveries)
CREATE TABLE IF NOT EXISTS culinary_discoveries (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty_name VARCHAR(500) NOT NULL,
    category VARCHAR(50) DEFAULT 'food',
    image_url TEXT NOT NULL,
    spice_rating INT DEFAULT 1,
    spice_label VARCHAR(100),
    flavor_tags JSON,
    price_range VARCHAR(100),
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    bearing_degrees DECIMAL(5, 2) NOT NULL,
    distance_meters INT DEFAULT 200,
    heritage_story TEXT,
    recommended_dishes JSON,
    must_try_tip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Nhật ký Cảm biến & Telemetry (Sensor Telemetry Logs)
CREATE TABLE IF NOT EXISTS sensor_telemetry_logs (
    id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(100),
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    altitude DECIMAL(8, 2),
    accuracy DECIMAL(6, 2),
    compass_bearing DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Mục Đã Lưu của Người Dùng (User Bookmarks)
CREATE TABLE IF NOT EXISTS user_bookmarks (
    user_id VARCHAR(100) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, target_id)
);
