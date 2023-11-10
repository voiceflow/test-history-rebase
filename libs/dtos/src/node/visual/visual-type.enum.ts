export const VisualType = {
  APL: 'apl',
  IMAGE: 'image',
} as const;

export type VisualType = (typeof VisualType)[keyof typeof VisualType];
