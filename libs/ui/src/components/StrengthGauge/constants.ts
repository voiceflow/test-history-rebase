export enum Level {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  NOT_SET = 'not_set',
  VERY_STRONG = 'very_strong',
  LOADING = 'loading',
}

export const StrengthColor: Record<Level, string> = {
  [Level.NOT_SET]: '',
  [Level.LOADING]: '',
  [Level.WEAK]: '#bd425f',
  [Level.MEDIUM]: '#4e8bbd',
  [Level.STRONG]: '#50a82e',
  [Level.VERY_STRONG]: '#449127',
};

export const TOOLTIP_LABEL_MAP = {
  [Level.WEAK]: 'Weak',
  [Level.MEDIUM]: 'Medium',
  [Level.STRONG]: 'Strong',
  [Level.NOT_SET]: 'Empty',
  [Level.LOADING]: 'Loading',
  [Level.VERY_STRONG]: 'Excellent',
};
