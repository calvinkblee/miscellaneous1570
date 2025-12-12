import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * TailwindCSS 클래스를 병합합니다.
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌을 해결합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 온도를 포맷팅합니다.
 * @param temp - 온도 (섭씨)
 * @returns 포맷팅된 온도 문자열
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 * @param date - Date 객체 또는 타임스탬프
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date * 1000) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}


