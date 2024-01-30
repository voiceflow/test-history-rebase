export interface IVariableDefaultValueSection {
  value: string | null;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
}
