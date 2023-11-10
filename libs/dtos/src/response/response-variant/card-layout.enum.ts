export const CardLayout = {
  CAROUSEL: 'carousel',
  LIST: 'list',
} as const;

export type CardLayout = (typeof CardLayout)[keyof typeof CardLayout];
