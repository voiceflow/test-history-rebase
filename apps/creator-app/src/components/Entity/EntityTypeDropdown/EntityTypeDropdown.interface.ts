export interface IEntityTypeDropdown {
  value: string | null;
  error?: string | null;
  onValueChange: (value: string) => void;
}
