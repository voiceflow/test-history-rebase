export interface ICMSEditorDescription {
  value: string;
  placeholder: string;
  showDivider?: boolean;
  onValueChange: (value: string) => void;
}
