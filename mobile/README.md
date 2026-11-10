# Heritage & Horizon Discovery - Flutter Mobile Application

Thư mục này chứa mã nguồn ứng dụng **Flutter Native** hoàn chỉnh, sẵn sàng biên dịch và chạy trên điện thoại **Android** hoặc **iOS**.

---

## 📁 Cấu trúc thư mục Flutter Mobile

```
mobile/
├── pubspec.yaml                 # Khai báo dependencies (sensors_plus, geolocator, camera)
├── README.md                    # Hướng dẫn cài đặt và chạy
└── lib/
    ├── main.dart                # Điểm khởi chạy chính (MaterialApp, NavigationBar)
    ├── models/
    │   └── heritage_model.dart  # Data model cho di tích & ẩm thực
    └── widgets/
        └── compass_sensor_card.dart  # Widget hiển thị la bàn & telemetry GPS
```

---

## 🚀 Hướng dẫn chạy trên điện thoại thật

### Yêu cầu tiên quyết:
- Đã cài đặt [Flutter SDK](https://docs.flutter.dev/get-started/install) (phiên bản >= 3.0.0).
- Đã cài đặt [Android Studio](https://developer.android.com/studio) hoặc [Xcode](https://developer.apple.com/xcode/) (dành cho iOS/macOS).

### Các bước thực hiện:

1. **Di chuyển vào thư mục mobile**:
   ```bash
   cd mobile
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   flutter pub get
   ```

3. **Kết nối điện thoại thật**:
   - **Android**: Bật *Tùy chọn nhà phát triển* $\rightarrow$ Bật *Gỡ lỗi USB (USB Debugging)* $\rightarrow$ Cắm cáp USB vào máy tính.
   - **iPhone**: Kết nối cáp với máy tính Mac $\rightarrow$ Bấm *Tin cậy máy tính này (Trust this computer)*.

4. **Kiểm tra thiết bị kết nối**:
   ```bash
   flutter devices
   ```

5. **Chạy ứng dụng lên điện thoại**:
   ```bash
   flutter run
   ```

---

## 📡 Kết nối Backend API
Mặc định ứng dụng có thể kết nối với Backend API Express tại endpoint:
- Local: `http://localhost:3000/api/heritage`
- Cloud: `https://ais-pre-wbekbwnini6limrax2wjbc-538544773831.asia-east1.run.app/api/heritage`
