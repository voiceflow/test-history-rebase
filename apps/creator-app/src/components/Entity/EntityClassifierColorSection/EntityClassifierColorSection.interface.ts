export interface IEntityClassifierColorSection {
  name: string;
  color: string;
  disabled?: boolean;
  typeError?: string | null;
  classifier: string | null;
  typeMinWidth?: number;
  onColorChange: (value: string) => void;
  onClassifierClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClassifierChange: (value: string) => void;
}
