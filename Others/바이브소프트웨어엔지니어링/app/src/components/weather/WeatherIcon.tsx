import { getWeatherIconUrl } from '@/services/weather';

interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
  className?: string;
}

const sizeMap = {
  sm: { px: 32, api: '1x' as const },
  md: { px: 48, api: '2x' as const },
  lg: { px: 64, api: '4x' as const },
};

/**
 * 날씨 아이콘 컴포넌트
 */
export const WeatherIcon = ({
  iconCode,
  size = 'md',
  alt = '날씨 아이콘',
  className = '',
}: WeatherIconProps) => {
  const { px, api } = sizeMap[size];
  const url = getWeatherIconUrl(iconCode, api);

  return (
    <img
      src={url}
      alt={alt}
      width={px}
      height={px}
      className={className}
      loading="lazy"
    />
  );
};


