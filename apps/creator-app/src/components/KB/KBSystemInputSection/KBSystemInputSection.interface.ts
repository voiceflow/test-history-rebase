export interface IKBSystemInputSection {
  value: string;
  testID?: string;
  maxRows?: number;
  disabled?: boolean;
  learnMoreURL: string;
  onValueChange: (value: string) => void;
}
