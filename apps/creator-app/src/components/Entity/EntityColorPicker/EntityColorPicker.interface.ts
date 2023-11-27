export interface IEntityColorPicker {
  name: string;
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
