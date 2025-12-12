/**
 * 날씨 카드 로딩 스켈레톤 컴포넌트
 */
export const WeatherSkeleton = () => {
  return (
    <div
      className="w-full max-w-sm animate-pulse rounded-lg bg-white p-6 shadow-card"
      data-testid="weather-skeleton"
    >
      {/* 위치명 */}
      <div className="mb-4 h-5 w-32 rounded bg-gray-200" />

      {/* 구분선 */}
      <div className="mb-4 border-b border-gray-100" />

      {/* 날씨 아이콘 */}
      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-200" />

      {/* 기온 */}
      <div className="mx-auto mb-2 h-10 w-24 rounded bg-gray-200" />

      {/* 체감온도 + 상태 */}
      <div className="mx-auto mb-4 h-4 w-40 rounded bg-gray-200" />

      {/* 구분선 */}
      <div className="mb-4 border-b border-gray-100" />

      {/* 습도, 풍속 */}
      <div className="flex justify-center gap-4">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
};


