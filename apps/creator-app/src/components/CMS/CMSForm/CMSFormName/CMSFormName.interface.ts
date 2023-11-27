export interface ICMSFormName {
  value: string;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  transform?: (value: string) => string;
  placeholder: string;
  onValueChange: (value: string) => void;
}
