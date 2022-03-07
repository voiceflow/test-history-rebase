import { SlideOutDirection } from '@/styles/transitions';

export type DrawerDirection = SlideOutDirection;

export interface DrawerProps {
  zIndex?: number;
  scrollable?: boolean;
  animatedWidth?: boolean;
  closable?: boolean;
  onToggle?: (value: boolean) => void;
}
