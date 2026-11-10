export type CategoryType = 'all' | 'heritage' | 'food' | 'audio' | 'saved';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
}

export interface HeritageItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'heritage';
  imageUrl: string;
  distanceMeters: number;
  bearingDegrees: number; // Direction relative to true North
  hasAudioTour: boolean;
  audioDurationMinutes: number;
  audioNarrationText: string;
  yearBuilt: string;
  era: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  architecturalHighlights: string[];
  tipsForVisitors: string;
}

export interface FoodItem {
  id: string;
  name: string;
  specialtyName: string;
  category: 'food';
  imageUrl: string;
  distanceMeters: number;
  bearingDegrees: number;
  spiceRating: number; // 0 to 3
  spiceLabel: string;
  flavorTags: string[];
  priceRange: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  heritageStory: string;
  recommendedDishes: string[];
  mustTryTip: string;
}

export type DiscoveryItem = HeritageItem | FoodItem;

export interface SensorState {
  compassBearing: number; // 0 - 359.9 deg
  isCompassActive: boolean;
  coordinates: LocationCoordinates;
  isGpsActive: boolean;
  isCameraActive: boolean;
  permissionGranted: boolean;
}
