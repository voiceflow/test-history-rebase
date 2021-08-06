import { BlockVariant } from '@/constants/canvas';

export interface ReorderIndicatorProps {
  index: number;
  isEnabled: boolean;
  variant: BlockVariant;
  onMouseUp: (event: React.MouseEvent) => void;
}
