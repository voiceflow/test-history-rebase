import { HSLShades } from '@/constants';

export interface ReorderIndicatorProps {
  index: number;
  isEnabled: boolean;
  palette: HSLShades;
  onMouseUp: (event: React.MouseEvent) => void;
}
