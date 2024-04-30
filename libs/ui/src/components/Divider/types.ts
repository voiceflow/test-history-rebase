import type { Theme } from '@/styles/theme';

export interface SimpleProps {
  theme: Theme;
  width?: number | string;
  height?: number | string;
  offset?: number | [number, number];
  isVertical?: boolean;
  isSecondaryColor?: boolean;
}

export interface LabeledHorizontalProps {
  isLast?: boolean;
}
