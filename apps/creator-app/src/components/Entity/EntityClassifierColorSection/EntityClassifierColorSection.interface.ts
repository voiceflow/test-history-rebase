export interface IEntityClassifierColorSection {
  name: string;
  color: string;
  disabled?: boolean;
  classifier: string | null;
  onColorChange: (value: string) => void;
  classifierError?: string | null;
  onClassifierClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClassifierChange: (value: string) => void;
  classifierMinWidth?: number;
}
