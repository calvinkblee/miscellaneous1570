import { cn } from '@/lib/utils';
import { FiveElement } from '@/types/agent';
import { ELEMENT_NAMES } from '@/configs/api';

interface ElementBadgeProps {
  element: FiveElement;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const ELEMENT_ICONS: Record<FiveElement, string> = {
  wood: '🪵',
  fire: '🔥',
  earth: '🌍',
  metal: '⚪',
  water: '💧',
};

export function ElementBadge({ element, size = 'md', showIcon = true }: ElementBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={cn('element-badge', `element-${element}`, sizes[size])}>
      {showIcon && <span>{ELEMENT_ICONS[element]}</span>}
      <span>{ELEMENT_NAMES[element]}</span>
    </span>
  );
}
