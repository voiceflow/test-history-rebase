import { BlockVariant } from '@/constants/canvas';

export type ReorderIndicatorProps = {
  index: number;
  isEnabled: boolean;
  variant: BlockVariant;
  onMouseUp: (event: React.MouseEvent) => void;
};
