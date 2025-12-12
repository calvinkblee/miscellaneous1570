불편을 드려 죄송합니다. 요청하신 대로, \*\*OpenWeatherMap API의 세 가지 핵심 API (지오코딩, 현재 날씨, 5일 예보)\*\*에 대한 **모든 요청 파라미터 설명, JSON 응답 예시 및 필드 설명**을 **하나의 최종 통합 문서**에 빠짐없이 정리하여 전달해 드립니다.

이 문서는 코딩 에이전트에게 전달할 **완전한 API 스펙 컨텍스트**로 사용하실 수 있습니다.

-----

## 📄 OpenWeatherMap API 프로젝트 통합 스펙 문서 (최종)

### 1\. 📍 지오코딩 API (Geocoding API)

#### 1.1. 직접 지오코딩 (Direct Geocoding: 이름 → 좌표)

| 구분 | 내용 |
| :--- | :--- |
| **요청 엔드포인트** | `http://api.openweathermap.org/geo/1.0/direct` |
| **예시 호출** | `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}` |

| 파라미터 | 필수 여부 | 설명 | 비고 |
| :--- | :--- | :--- | :--- |
| **`q`** | **required** | City name, state code (only for the US) and country code divided by comma. | Please use ISO 3166 country codes. |
| **`appid`** | **required** | Your unique API key. | |
| **`limit`** | optional | Number of the locations in the API response (up to 5 results). | |

**A. 응답 JSON 예시**

```json
[
   {
      "name":"London",
      "local_names":{
         "ms":"London",
         // ... 다국어 이름 생략 ...
         "ko":"런던",
         "ascii":"London",
         "feature_name":"London"
      },
      "lat":51.5073219,
      "lon":-0.1276474,
      "country":"GB",
      "state":"England"
   }
]
```

**B. 응답 필드 설명**

  * `name`: Name of the found location
  * `local_names`:
      * `local_names.[language code]`: Name of the found location in different languages.
      * `local_names.ascii`: Internal field
      * `local_names.feature_name`: Internal field
  * `lat`: Geographical coordinates of the found location (latitude)
  * `lon`: Geographical coordinates of the found location (longitude)
  * `country`: Country of the found location
  * `state`: State of the found location (where available)

-----

#### 1.2. 역 지오코딩 (Reverse Geocoding: 좌표 → 이름)

| 구분 | 내용 |
| :--- | :--- |
| **요청 엔드포인트** | `http://api.openweathermap.org/geo/1.0/reverse` |
| **예시 호출** | `http://api.openweathermap.org/geo/1.0/reverse?lat=51.5098&lon=-0.1180&limit=5&appid={API key}` |

| 파라미터 | 필수 여부 | 설명 | 비고 |
| :--- | :--- | :--- | :--- |
| **`lat`, `lon`** | **required** | Geographical coordinates (latitude, longitude) | |
| **`appid`** | **required** | Your unique API key. | |
| **`limit`** | optional | Number of the location names in the API response. | |

**A. 응답 JSON 예시**

```json
[
  {
    "name": "City of London",
    "local_names": {
      "ar": "مدينة لندن",
      // ... 다국어 이름 생략 ...
      "en": "City of London"
    },
    "lat": 51.5128,
    "lon": -0.0918,
    "country": "GB"
  }
]
```

**B. 응답 필드 설명** (Direct Geocoding과 동일)

-----

-----

### 2\. 🌤️ 현재 날씨 데이터 (Current Weather Data)

| 구분 | 내용 |
| :--- | :--- |
| **요청 엔드포인트** | `https://api.openweathermap.org/data/2.5/weather` |
| **예시 호출** | `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}` |

| 파라미터 | 필수 여부 | 설명 | 비고 |
| :--- | :--- | :--- | :--- |
| **`lat`, `lon`** | **required** | Latitude and Longitude. | Use Geocoding API to convert city names to coordinates. |
| **`appid`** | **required** | Your unique API key. | |
| **`mode`** | optional | Response format. Possible values are `xml` and `html`. | Default is JSON. |
| **`units`** | optional | Units of measurement: `standard`, `metric`, or `imperial`. | Default is `standard` (Kelvin). |
| **`lang`** | optional | You can use this parameter to get the output in your language. | |

**A. 응답 JSON 예시 (Example JSON Response)**

```json
{
   "coord": { "lon": 7.367, "lat": 45.133 },
   "weather": [ { "id": 501, "main": "Rain", "description": "moderate rain", "icon": "10d" } ],
   "base": "stations",
   "main": { "temp": 284.2, "feels_like": 282.93, "temp_min": 283.06, "temp_max": 286.82, "pressure": 1021, "humidity": 60, "sea_level": 1021, "grnd_level": 910 },
   "visibility": 10000,
   "wind": { "speed": 4.09, "deg": 121, "gust": 3.47 },
   "rain": { "1h": 2.73 },
   "clouds": { "all": 83 },
   "dt": 1726660758,
   "sys": { "type": 1, "id": 6736, "country": "IT", "sunrise": 1726636384, "sunset": 1726680975 },
   "timezone": 7200, "id": 3165523,
   "name": "Province of Turin", "cod": 200
}
```

**B. 응답 필드 설명 (Full Field Description)**

  * **`coord.lon`**, **`coord.lat`**: Longitude/Latitude of the location
  * **`weather`**: (Array)
      * `weather.id`, `weather.main` (Group of parameters: Rain, Snow, Clouds etc.), `weather.description`, `weather.icon`
  * **`main`**:
      * `main.temp`, `main.feels_like`, `main.temp_min`, `main.temp_max`: Temperature parameters (units based on `units` parameter)
      * `main.pressure`, `main.sea_level`, `main.grnd_level`: Atmospheric pressure, hPa
      * `main.humidity`: Humidity, %
  * **`visibility`**: Visibility, meter.
  * **`wind`**:
      * `wind.speed`: Wind speed
      * `wind.deg`: Wind direction, degrees (meteorological)
      * `wind.gust`: Wind gust
  * **`clouds.all`**: Cloudiness, %
  * **`rain.1h`** / **`snow.1h`**: Precipitation, mm/h (where available)
  * **`dt`**: Time of data calculation, unix, UTC
  * **`sys.country`**: Country code (GB, JP etc.)
  * **`sys.sunrise`**, **`sys.sunset`**: Sunrise/Sunset time, unix, UTC
  * **`timezone`**: Shift in seconds from UTC
  * **`name`**: City name.
  * **`base`**, **`id`**, **`cod`**: Internal parameters.

-----

-----

### 3\. 🗓️ 5일 / 3시간 예보 데이터 (Forecast Data)

| 구분 | 내용 |
| :--- | :--- |
| **요청 엔드포인트** | `api.openweathermap.org/data/2.5/forecast` |
| **예시 호출** | `api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}` |

| 파라미터 | 필수 여부 | 설명 | 비고 |
| :--- | :--- | :--- | :--- |
| **`lat`, `lon`** | **required** | Latitude and Longitude. | |
| **`appid`** | **required** | Your unique API key. | |
| **`units`** | optional | Units of measurement. | |
| **`mode`** | optional | Response format. `mode=xml` for XML. | Default is JSON. |
| **`cnt`** | optional | A number of timestamps, which will be returned. | |
| **`lang`** | optional | Language for output. | |

**A. 응답 JSON 예시 (Example JSON Response)**

```json
{
  "cod": "200", "message": 0, "cnt": 40,
  "list": [
    {
      "dt": 1661871600,
      "main": { "temp": 296.76, "feels_like": 296.98, "temp_min": 296.76, "temp_max": 297.87, "pressure": 1015, "sea_level": 1015, "grnd_level": 933, "humidity": 69, "temp_kf": -1.11 },
      "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ],
      "clouds": { "all": 100 }, "wind": { "speed": 0.62, "deg": 349, "gust": 1.18 },
      "visibility": 10000, "pop": 0.32, "rain": { "3h": 0.26 },
      "sys": { "pod": "d" }, "dt_txt": "2022-08-30 15:00:00"
    }
    // ... (38 more elements)
  ],
  "city": { "id": 3163858, "name": "Zocca", "coord": { "lat": 44.34, "lon": 10.99 }, "country": "IT", "population": 4593, "timezone": 7200, "sunrise": 1661834187, "sunset": 1661882248 }
}
```

**B. 응답 필드 설명 (Full Field Description)**

  * **`list`** (Array):
      * `list.dt`: Time of data forecasted, unix, UTC
      * `list.dt_txt`: Time of data forecasted, ISO, UTC
      * `list.main` fields (`temp`, `feels_like`, `humidity`, etc.): All fields related to main weather data at the forecasted time.
      * `list.weather` fields: All fields related to weather condition at the forecasted time.
      * `list.pop`: **Probability of precipitation** (0 to 1)
      * `list.rain.3h` / `list.snow.3h`: Rain/Snow volume for last 3 hours, mm.
      * `list.sys.pod`: Part of the day (n - night, d - day)
  * **`city`**:
      * `city.id`, `city.name`, `city.coord.lat`/`lon`, `city.country`, `city.population`, `city.timezone`, `city.sunrise`/`sunset` (All fields related to the forecast location)
  * **`cod`**, **`message`**, **`cnt`**: Internal parameters / A number of timestamps returned.

-----
