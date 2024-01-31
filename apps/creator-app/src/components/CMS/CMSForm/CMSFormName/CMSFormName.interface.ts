export interface ICMSFormName {
  value: string;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  transform?: (value: string) => string;
  rightLabel?: React.ReactElement;
  placeholder: string;
  containerRef?: React.Ref<HTMLDivElement>;
  onValueChange: (value: string) => void;
  onPointerEnter?: React.PointerEventHandler<HTMLInputElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLInputElement>;
  testID?: string;
}
