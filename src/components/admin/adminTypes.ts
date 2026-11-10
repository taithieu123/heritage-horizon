export type AdminTab = 
  | 'overview' 
  | 'landmarks' 
  | 'culinary' 
  | 'restaurants' 
  | 'users' 
  | 'settings' 
  | 'database';

export interface AdminStats {
  landmarksActive: number;
  landmarksNew3D: number;
  landmarksGrowthPercent: number;
  culinaryItems: number;
  culinaryAllergens: number;
  restaurantsTotal: number;
  restaurantsPending: number;
  arScansTotal: number;
  arScansGrowthPercent: number;
  retentionRate: number;
}

export interface UrgentVerificationTask {
  id: string;
  name: string;
  address: string;
  dishName: string;
  coords: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface CalibrationAlert {
  id: string;
  landmarkName: string;
  viewportDesc: string;
  errorDesc: string;
  errorDelta: string;
  reason: string;
  reportedByUsers: number;
  actionText: string;
}

export interface AdminActivityLog {
  id: string;
  userName: string;
  userRole: string;
  timeAgo: string;
  actionDesc: string;
  tags?: string[];
}

export interface AdminLandmarkRecord {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  district: string;
  address: string;
  category: 'historical' | 'architectural' | 'scenic' | 'religious';
  badge: 'QG-ĐB' | 'UNESCO' | 'DT-LS' | 'DT-KT';
  coordsFormatted: string;
  lat: number;
  lng: number;
  bearing: string;
  headingDegrees: number;
  pitchDegrees: number;
  rating: number;
  hasAR: boolean;
  hasAudio: boolean;
  geofenceRadius: number;
  meshSizeMb: number;
  meshLOD: string;
  imageUrl: string;
  era: string;
  linkedFoodsCount: number;
}

export interface AdminRestaurantRecord {
  id: string;
  code: string;
  name: string;
  ownerName: string;
  supervisor: string;
  address: string;
  coordsFormatted: string;
  lat: number;
  lng: number;
  gpsAccuracy: string;
  dishName: string;
  dishTag: string;
  dishIngredients: string;
  auditPassed: string;
  status: 'pending' | 'verified' | 'need_inspect' | 'suspended';
  statusLabel: string;
  arMatchingPercent: number;
  geofenceNearName: string;
  geofenceNearDist: string;
  safetyLicenseImg: string;
  facadeImg: string;
}

export interface AdminCulinaryRecord {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  originRegion: string;
  historicalEra: string;
  coreIngredients: string;
  allergens: {
    label: string;
    type: 'danger' | 'warning' | 'safe' | 'info';
  }[];
  servingRestaurantsCount: number;
  priceRange: string;
  status: 'serving' | 'paused';
  imageUrl: string;
}

export interface AdminAllergenRecord {
  id: string;
  code: string;
  name: string;
  risk_level: 'danger' | 'warning' | 'safe' | 'info';
  symptoms_desc: string;
  common_in_dishes: string;
  created_at?: string;
}
