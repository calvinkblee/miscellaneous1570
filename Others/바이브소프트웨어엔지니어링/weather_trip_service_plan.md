## Weather-Based Travel Recommendation Flow

1. **OpenWeather Geocoding → Coordinates**
   - Endpoint `http://api.openweathermap.org/geo/1.0/direct`, params `q`, `limit`, `appid`.
   - Resolves user text locations into lat/lon for all downstream weather and Places queries.

2. **OpenWeather Current Weather Snapshot**
   - Endpoint `https://api.openweathermap.org/data/2.5/weather` with `lat`, `lon`, `units=metric`, `appid`.
   - Use `main.temp`, `weather[].main`, `wind`, `rain/snow`, etc. to classify “현재 날씨”.

3. **OpenWeather 5-Day / 3-Hour Forecast**
   - Endpoint `https://api.openweathermap.org/data/2.5/forecast`.
   - Inspect `list[].dt_txt`, `list[].weather`, `list[].pop` to anticipate near-future conditions (e.g., rain soon ⇒ indoor spots).

4. **Map Weather to Travel Themes**
   - Define rules such as:
     - Clear & hot ⇒ beach / outdoor water.
     - Rain / high `pop` ⇒ indoor museums, cafés.
     - Windy & cold ⇒ cozy food, spa.
   - Each rule outputs a text search query + optional filters.

5. **Google Places Text Search (New)**
   - POST `https://places.googleapis.com/v1/places:searchText`.
   - Body includes `textQuery` built from theme + city, optional `locationBias`, `minRating`, `priceLevels`, etc.
   - Headers: `X-Goog-Api-Key`, mandatory `X-Goog-FieldMask` (e.g., `places.displayName,places.formattedAddress,places.id,places.photos`).
   - Paginate via `pageSize` (≤20) and `nextPageToken` if more candidates needed.

6. **Google Place Details (New)**
   - GET `https://places.googleapis.com/v1/places/PLACE_ID`.
   - Use FieldMask to fetch `displayName`, `rating`, `userRatingCount`, `currentOpeningHours`, `priceLevel`, `types`, `websiteUri`, etc.
   - Confirms suitability (open now, indoor/outdoor, price).

7. **Google Place Photos (New)**
   - GET `https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=1200&key=API_KEY`.
   - Obtain `photo_name` from `places.photos[].name` (Text Search) or `photos[].name` (Place Details).
   - Optional `skipHttpRedirect=true` when you need JSON metadata before fetching binary.

8. **Response Assembly**
   - Combine weather summary + rationale (“현재 12°C, 비 예보로 실내 활동 추천”).
   - For each place: name, short reason, rating, address, distance, opening hours, Google Maps link, hero photo.
   - Cache short-lived weather + place sets per city to reduce API calls (respect no-caching rules for photo names).

9. **Operational Notes**
   - Store API keys in secrets manager/env vars.
   - Track quota per SKU (Text Search vs Place Details vs Photos).
   - Log query, chosen weather rule, selected places for future ML improvements.


