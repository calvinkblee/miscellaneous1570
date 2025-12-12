// API 설정

export const API_CONFIG = {
  OPENAI_API_KEY:
    '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',
  DEFAULT_MODEL: 'gpt-4o-mini' as const,
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
};

export const FORTUNE_PHRASES = {
  excellent: '대길(大吉) - 훌륭한 Agent입니다!',
  good: '중길(中吉) - 좋은 성과가 기대됩니다',
  fair: '소길(小吉) - 개선의 여지가 있습니다',
  poor: '흉(凶) - 수정이 필요합니다',
};

export const ELEMENT_NAMES: Record<string, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

export const ELEMENT_DESCRIPTIONS: Record<string, string> = {
  wood: '기획 단계 - 성장과 확장',
  fire: '개발 단계 - 빠른 처리',
  earth: '통합 단계 - 안정과 조화',
  metal: '배포 운영 - 정밀함',
  water: '품질 검증 - 유연함',
};
