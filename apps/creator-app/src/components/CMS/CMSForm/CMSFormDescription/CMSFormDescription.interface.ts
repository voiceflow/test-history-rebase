export interface ICMSFormDescription {
  value: string;
  error?: string | null;
  minRows?: number;
  maxRows?: number;
  placeholder: string;
  onValueChange: (value: string) => void;
  testID?: string;
}
