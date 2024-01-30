export interface IVariableColorPicker {
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
