export interface ICMSFormDescription {
  pb?: number;
  pt?: number;
  value: string;
  error?: string | null;
  placeholder: string;
  onValueChange: (value: string) => void;
}
