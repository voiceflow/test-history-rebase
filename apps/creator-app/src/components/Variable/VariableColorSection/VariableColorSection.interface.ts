export interface IVariableColorSection {
  name?: string;
  color: string;
  disabled?: boolean;
  onColorChange: (value: string) => void;
}
