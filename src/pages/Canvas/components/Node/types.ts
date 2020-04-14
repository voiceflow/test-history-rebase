export type ReorderIndicatorProps = {
  index: number;
  onMouseUp: (event: React.MouseEvent) => void;
  hoveredIndex?: number | null;
  recalculate: boolean;
};
