import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle conflicting tailwind classes', () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn('px-4', 'px-8');
    expect(result).toBe('px-8');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should filter out falsy values', () => {
    const result = cn('base-class', false && 'hidden', undefined, null, 'visible');
    expect(result).toBe('base-class visible');
  });

  it('should handle object syntax', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toBe('base active');
  });

  it('should handle array syntax', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toBe('class1 class2');
  });

  it('should return empty string for no input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

