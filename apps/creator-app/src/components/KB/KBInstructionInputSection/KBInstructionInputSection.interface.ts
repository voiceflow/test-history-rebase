export interface IKBInstructionInputSection {
  value: string;
  testID?: string;
  maxRows?: number;
  disabled?: boolean;
  learnMoreURL: string;
  onValueChange: (value: string) => void;
}
