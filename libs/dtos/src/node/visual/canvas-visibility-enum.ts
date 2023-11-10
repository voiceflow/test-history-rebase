export const CanvasVisibility = {
  FULL: 'full',
  HIDDEN: 'hidden',
  CROPPED: 'cropped',
} as const;

export type CanvasVisibility = (typeof CanvasVisibility)[keyof typeof CanvasVisibility];
