import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스를 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 충돌하는 클래스를 지능적으로 병합합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

