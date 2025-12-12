import { create } from 'zustand';
import type { Location, WeatherInfo } from '@/types/weather';

interface WeatherState {
  // 상태
  currentLocation: Location | null;
  selectedLocation: Location | null;
  currentWeather: WeatherInfo | null;
  isLocationPermissionGranted: boolean;

  // 액션
  setCurrentLocation: (location: Location | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  setCurrentWeather: (weather: WeatherInfo | null) => void;
  setLocationPermission: (granted: boolean) => void;
  clearWeather: () => void;
  reset: () => void;
}

const initialState = {
  currentLocation: null,
  selectedLocation: null,
  currentWeather: null,
  isLocationPermissionGranted: false,
};

export const useWeatherStore = create<WeatherState>((set) => ({
  ...initialState,

  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  setLocationPermission: (granted) => set({ isLocationPermissionGranted: granted }),
  clearWeather: () => set({ currentLocation: null, currentWeather: null }),
  reset: () => set(initialState),
}));

