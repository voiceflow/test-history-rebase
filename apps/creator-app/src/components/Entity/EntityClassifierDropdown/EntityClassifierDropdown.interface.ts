export interface IEntityClassifierDropdown {
  value: string | null;
  error?: string | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  minWidth?: number;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
