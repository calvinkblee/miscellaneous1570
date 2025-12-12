import { cn, formatTemperature, formatDate } from './utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatTemperature', () => {
  it('formats temperature with degree symbol', () => {
    expect(formatTemperature(25)).toBe('25°C');
    expect(formatTemperature(25.4)).toBe('25°C');
    expect(formatTemperature(25.6)).toBe('26°C');
  });

  it('handles negative temperatures', () => {
    expect(formatTemperature(-5)).toBe('-5°C');
  });
});

describe('formatDate', () => {
  it('formats date correctly in Korean', () => {
    const date = new Date('2024-12-04T12:00:00');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024년');
    expect(formatted).toContain('12월');
    expect(formatted).toContain('4일');
  });

  it('handles unix timestamp', () => {
    const timestamp = 1701691200; // 2023-12-04 12:00:00 UTC
    const formatted = formatDate(timestamp);
    expect(formatted).toContain('2023년');
  });
});


