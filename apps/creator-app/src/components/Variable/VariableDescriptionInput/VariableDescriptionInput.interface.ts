export interface IVariableDescriptionInput {
  value: string | null;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
}
