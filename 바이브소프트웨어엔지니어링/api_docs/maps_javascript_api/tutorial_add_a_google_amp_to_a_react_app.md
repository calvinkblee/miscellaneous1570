제공해주신 Google Maps Codelab 내용을 바탕으로 정리한 마크다운(Markdown) 문서입니다.

-----

# React 앱에 Google 지도 추가하기 (Codelab)

이 튜토리얼에서는 Google Maps JavaScript API용 `vis.gl/react-google-map` 라이브러리를 사용하여 React 앱에 Google 지도를 추가하는 방법을 다룹니다.

## 1\. 시작하기 전에

**배울 내용:**

  * `vis.gl/react-google-map` 라이브러리 시작 방법
  * Maps JavaScript API를 선언적으로 로드하는 방법
  * 지도 표시, 마커(Markers) 및 마커 클러스터링(Clustering) 사용법
  * 사용자 상호작용 처리 및 지도 위에 그리기(Drawing)

**필요한 항목:**

  * Google Cloud 계정 (결제 활성화됨)
  * Google Maps Platform API 키 (Maps JavaScript API 활성화됨)
  * Node.js 설치
  * 텍스트 에디터 (VS Code 등)

### Google Maps Platform 설정

1.  Google Cloud Console에서 프로젝트를 선택합니다.

2.  Marketplace에서 **Maps JavaScript API**를 활성화합니다.

3.  **사용자 인증 정보(Credentials)** 페이지에서 **API Key**를 생성합니다.

-----

## 2\. 설정 (Set up)

### 스타터 프로젝트 다운로드

터미널에서 다음 명령어를 실행하여 스타터 코드를 복제하고 의존성을 설치합니다.

```bash
git clone https://github.com/googlemaps-samples/codelab-maps-platform-101-react-js.git
cd starter && npm install
```

### 개발 서버 실행

다음 명령어로 로컬 개발 서버를 실행합니다.

```bash
npm start
```

브라우저에서 "Hello, world\!"가 표시되면 준비가 완료된 것입니다.

-----

## 3\. Maps JavaScript API 로드

`vis.gl/react-google-map` 라이브러리의 `APIProvider` 컴포넌트를 사용하여 API를 로드합니다.

`/src/app.tsx` 파일을 열고 다음과 같이 수정합니다.

```tsx
import React from 'react';
import {createRoot} from "react-dom/client";
import {APIProvider} from '@vis.gl/react-google-maps';

const App = () => (
 <APIProvider apiKey={'여기에_API_키를_입력하세요'} onLoad={() => console.log('Maps API has loaded.')}>
   <h1>Hello, world!</h1>
 </APIProvider>
);

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;
```

-----

## 4\. 지도 표시하기

`Map` 컴포넌트를 사용하여 지도를 렌더링합니다. 시드니를 중심으로 설정합니다.

`/src/app.tsx`를 업데이트합니다:

```tsx
import React from 'react';
import {createRoot} from "react-dom/client";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';

const App = () => (
 <APIProvider apiKey={'여기에_API_키를_입력하세요'} onLoad={() => console.log('Maps API has loaded.')}>
   <Map
      defaultZoom={13}
      defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
      onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }>
   </Map>
 </APIProvider>
);

// ... (root 렌더링 부분은 동일)
```

-----

## 5\. 클라우드 기반 지도 스타일링 추가

Advanced Markers를 사용하기 위해 **Map ID**가 필요합니다.

1.  Google Cloud Console에서 Map ID를 생성하고 지도 스타일을 연결합니다.
2.  `<Map>` 컴포넌트에 `mapId` 속성을 추가합니다.

<!-- end list -->

```tsx
<Map
    defaultZoom={13}
    defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
    mapId='DEMO_MAP_ID' // 여기에 생성한 Map ID 입력
    onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
    }>
</Map>
```

-----

## 6\. 지도에 마커 추가하기

Advanced Markers를 사용하여 특정 위치를 표시합니다.

1.  **위치 데이터 생성:**

<!-- end list -->

```tsx
type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
  {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
  // ... (나머지 위치 데이터)
];
```

2.  **PoiMarkers 컴포넌트 생성 및 `Pin` 사용:**

<!-- end list -->

```tsx
import { APIProvider, Map, AdvancedMarker, MapCameraChangedEvent, Pin } from '@vis.gl/react-google-maps';

const PoiMarkers = (props: {pois: Poi[]}) => {
  return (
    <>
      {props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};
```

3.  **App 컴포넌트에 추가:**

<!-- end list -->

```tsx
<Map ... >
  <PoiMarkers pois={locations} />
</Map>
```

-----

## 7\. 마커 클러스터링 활성화

마커가 많을 경우 겹치는 현상을 방지하기 위해 `@googlemaps/markerclusterer`를 사용합니다.

**PoiMarkers 컴포넌트 업데이트:**

```tsx
import {useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import React, {useEffect, useState, useRef} from 'react';

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // 1. 맵이 변경되면 Clusterer 초기화
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // 2. 마커 목록이 변경되면 Clusterer 업데이트
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  // 3. 새 마커 참조 생성 함수
  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;
    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)} // ref 설정
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};
```

-----

## 8\. 사용자 상호작용 추가 (User Interaction)

마커 클릭 시 해당 위치로 지도를 이동시키는 기능을 추가합니다.

1.  **클릭 핸들러 생성:**

<!-- end list -->

```tsx
const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
});
```

2.  **AdvancedMarker에 이벤트 연결:**

<!-- end list -->

```tsx
<AdvancedMarker
  ...
  clickable={true}
  onClick={handleClick}
>
```

-----

## 9\. 지도 위에 그리기 (Drawing)

마커를 클릭했을 때 주변 반경(원)을 표시합니다. `src/components/circle.tsx`에 있는 `Circle` 컴포넌트를 사용합니다.

1.  **Circle import 및 상태 추가:**

<!-- end list -->

```tsx
import {Circle} from './components/circle';

// PoiMarkers 내부
const [circleCenter, setCircleCenter] = useState(null);
```

2.  **클릭 핸들러 업데이트:**

<!-- end list -->

```tsx
const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    // ... 기존 코드
    setCircleCenter(ev.latLng);
});
```

3.  **Circle 렌더링 추가:**

<!-- end list -->

```tsx
return (
    <>
      <Circle
          radius={800}
          center={circleCenter}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
        />
      {/* ... 마커 매핑 코드 ... */}
    </>
);
```

-----

## 10\. 축하합니다\!

이제 `vis.gl/react-google-map` 라이브러리를 사용하여 React 앱에 Google 지도를 성공적으로 추가하고, 마커 클러스터링 및 사용자 상호작용 기능을 구현했습니다.

**더 알아보기:**

  * [vis.gl/react-google-map 문서](https://visgl.github.io/react-google-maps/)
  * [Google Maps JavaScript API 문서](https://developers.google.com/maps/documentation/javascript)

-----
