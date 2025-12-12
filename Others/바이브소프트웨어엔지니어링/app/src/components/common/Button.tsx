import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 기본 버튼 컴포넌트
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // variant 스타일
          {
            'bg-primary text-white hover:bg-primary-light active:bg-primary-dark':
              variant === 'primary',
            'border-2 border-primary bg-transparent text-primary hover:bg-primary/10':
              variant === 'secondary',
            'bg-transparent text-primary hover:bg-primary/10': variant === 'ghost',
          },

          // size 스타일
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-13 px-8 text-lg': size === 'lg',
          },

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';


