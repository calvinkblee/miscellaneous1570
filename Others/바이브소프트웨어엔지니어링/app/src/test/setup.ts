import '@testing-library/jest-dom';

// Mock import.meta.env for Vite
jest.mock('@/configs/env', () => ({
  env: {
    OPENWEATHER_API_KEY: 'test-api-key',
    GOOGLE_PLACES_API_KEY: 'test-places-key',
    GOOGLE_MAPS_API_KEY: 'test-maps-key',
    API_BASE_URL: 'https://api.openweathermap.org',
    IS_DEVELOPMENT: true,
    IS_PRODUCTION: false,
  },
}));
