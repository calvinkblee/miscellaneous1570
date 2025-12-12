/**
 * 장소 정보 타입
 */
export interface PlaceInfo {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: PriceLevel;
  photos?: PlacePhoto[];
  currentOpeningHours?: OpeningHours;
  websiteUri?: string;
  googleMapsUri?: string;
  types?: string[];
}

/**
 * 가격대 타입
 */
export type PriceLevel =
  | 'PRICE_LEVEL_FREE'
  | 'PRICE_LEVEL_INEXPENSIVE'
  | 'PRICE_LEVEL_MODERATE'
  | 'PRICE_LEVEL_EXPENSIVE'
  | 'PRICE_LEVEL_VERY_EXPENSIVE';

/**
 * 장소 사진 타입
 */
export interface PlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: AuthorAttribution[];
}

/**
 * 저자 귀속 정보 타입
 */
export interface AuthorAttribution {
  displayName: string;
  uri?: string;
  photoUri?: string;
}

/**
 * 영업 시간 타입
 */
export interface OpeningHours {
  openNow: boolean;
  weekdayDescriptions?: string[];
}

/**
 * 장소 검색 요청 타입
 */
export interface PlaceSearchRequest {
  textQuery: string;
  locationBias?: {
    circle: {
      center: {
        latitude: number;
        longitude: number;
      };
      radius: number;
    };
  };
  languageCode?: string;
  includedType?: string;
  openNow?: boolean;
  minRating?: number;
  pageSize?: number;
}

/**
 * 장소 검색 응답 타입
 */
export interface PlaceSearchResponse {
  places: PlaceInfo[];
  nextPageToken?: string;
}


