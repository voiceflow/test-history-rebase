export interface ICMSFormName {
  pb: number;
  pt?: number;
  value: string;
  error?: string | null;
  autoFocus?: boolean;
  placeholder: string;
  onValueChange: (value: string) => void;
}
