export interface DrawerProps {
  zIndex?: number;
  closable?: boolean;
  onToggle?: (value: boolean) => void;
  scrollable?: boolean;
  animatedWidth?: boolean;
  overflowHidden?: boolean;
}
