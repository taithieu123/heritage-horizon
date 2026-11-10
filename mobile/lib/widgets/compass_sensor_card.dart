import 'dart:math' as math;
import 'package:flutter/material.dart';

class CompassSensorCard extends StatelessWidget {
  final double bearingDegrees;
  final double latitude;
  final double longitude;
  final double altitude;
  final VoidCallback onRequestGps;
  final VoidCallback onOpenAR;

  const CompassSensorCard({
    super.key,
    required this.bearingDegrees,
    required this.latitude,
    required this.longitude,
    required this.altitude,
    required this.onRequestGps,
    required this.onOpenAR,
  });

  String _getDirectionName(double deg) {
    const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    final idx = ((deg / 45).round()) % 8;
    return dirs[idx];
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F6F2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFC9DBD0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F1B4D3E),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1B4D3E).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.sensors, size: 18, color: Color(0xFF1B4D3E)),
                  ),
                  const SizedBox(width: 8),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'PHÒNG THÍ NGHIỆM CẢM BIẾN',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1B4D3E),
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        'Spatial Telemetry & AR Engine',
                        style: TextStyle(fontSize: 10, color: Color(0xFF404945)),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF76A286).withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.explore, size: 14, color: Color(0xFF1B4D3E)),
                    const SizedBox(width: 4),
                    Text(
                      '${bearingDegrees.toStringAsFixed(1)}° (${_getDirectionName(bearingDegrees)})',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1B4D3E),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Compass & GPS Telemetry Grid
          Row(
            children: [
              // Rotating Compass Disc
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFEDF6F1),
                  border: Border.all(color: const Color(0xFF1B4D3E).withOpacity(0.25), width: 2),
                ),
                child: Center(
                  child: Transform.rotate(
                    angle: bearingDegrees * (math.pi / 180),
                    child: const Icon(
                      Icons.navigation,
                      size: 32,
                      color: Color(0xFFD96B27),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // GPS Values
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFDFE8E2)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Vĩ độ: ', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text('${latitude.toStringAsFixed(4)}° B', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Kinh độ: ', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text('${longitude.toStringAsFixed(4)}° Đ', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Độ cao: ', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text('${altitude.toStringAsFixed(1)} m', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onRequestGps,
                  icon: const Icon(Icons.my_location, size: 16),
                  label: const Text('Lấy GPS', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF1B4D3E),
                    backgroundColor: const Color(0xFF76A286).withOpacity(0.18),
                    side: BorderSide(color: const Color(0xFF76A286).withOpacity(0.4)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: onOpenAR,
                  icon: const Icon(Icons.camera_alt, size: 16),
                  label: const Text('Bật Camera AR', style: TextStyle(fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1B4D3E),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
