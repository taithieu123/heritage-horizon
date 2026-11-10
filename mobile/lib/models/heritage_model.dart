// Flutter Models for Heritage and Food
class HeritageLandmark {
  final String id;
  final String title;
  final String subtitle;
  final String imageUrl;
  final int distanceMeters;
  final double bearingDegrees;
  final bool hasAudioTour;
  final double audioDurationMinutes;
  final String audioNarrationText;
  final String yearBuilt;
  final String era;
  final String address;
  final double latitude;
  final double longitude;
  final String description;
  final List<String> architecturalHighlights;
  final String tipsForVisitors;

  HeritageLandmark({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.distanceMeters,
    required this.bearingDegrees,
    required this.hasAudioTour,
    required this.audioDurationMinutes,
    required this.audioNarrationText,
    required this.yearBuilt,
    required this.era,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.description,
    required this.architecturalHighlights,
    required this.tipsForVisitors,
  });

  factory HeritageLandmark.fromJson(Map<String, dynamic> json) {
    return HeritageLandmark(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      distanceMeters: json['distanceMeters'] ?? 0,
      bearingDegrees: (json['bearingDegrees'] as num?)?.toDouble() ?? 0.0,
      hasAudioTour: json['hasAudioTour'] ?? false,
      audioDurationMinutes: (json['audioDurationMinutes'] as num?)?.toDouble() ?? 5.0,
      audioNarrationText: json['audioNarrationText'] ?? '',
      yearBuilt: json['yearBuilt'] ?? '',
      era: json['era'] ?? '',
      address: json['address'] ?? '',
      latitude: (json['coordinates']?['lat'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['coordinates']?['lng'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      architecturalHighlights: List<String>.from(json['architecturalHighlights'] ?? []),
      tipsForVisitors: json['tipsForVisitors'] ?? '',
    );
  }
}

class CulinaryDiscovery {
  final String id;
  final String name;
  final String specialtyName;
  final String imageUrl;
  final int distanceMeters;
  final double bearingDegrees;
  final int spiceRating;
  final String spiceLabel;
  final List<String> flavorTags;
  final String priceRange;
  final String address;
  final double latitude;
  final double longitude;
  final String heritageStory;
  final List<String> recommendedDishes;
  final String mustTryTip;

  CulinaryDiscovery({
    required this.id,
    required this.name,
    required this.specialtyName,
    required this.imageUrl,
    required this.distanceMeters,
    required this.bearingDegrees,
    required this.spiceRating,
    required this.spiceLabel,
    required this.flavorTags,
    required this.priceRange,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.heritageStory,
    required this.recommendedDishes,
    required this.mustTryTip,
  });

  factory CulinaryDiscovery.fromJson(Map<String, dynamic> json) {
    return CulinaryDiscovery(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      specialtyName: json['specialtyName'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      distanceMeters: json['distanceMeters'] ?? 0,
      bearingDegrees: (json['bearingDegrees'] as num?)?.toDouble() ?? 0.0,
      spiceRating: json['spiceRating'] ?? 1,
      spiceLabel: json['spiceLabel'] ?? '',
      flavorTags: List<String>.from(json['flavorTags'] ?? []),
      priceRange: json['priceRange'] ?? '',
      address: json['address'] ?? '',
      latitude: (json['coordinates']?['lat'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['coordinates']?['lng'] as num?)?.toDouble() ?? 0.0,
      heritageStory: json['heritageStory'] ?? '',
      recommendedDishes: List<String>.from(json['recommendedDishes'] ?? []),
      mustTryTip: json['mustTryTip'] ?? '',
    );
  }
}
