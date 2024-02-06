export interface IComponentDescriptionInput {
  value: string | null;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
}
