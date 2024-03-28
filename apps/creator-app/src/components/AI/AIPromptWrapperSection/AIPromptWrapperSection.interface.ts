export interface IAIPromptWrapperSection {
  value: string;
  testID?: string;
  disabled?: boolean;
  learnMoreURL: string;
  defaultValue: string;
  onValueChange: (value: string) => void;
  onResetToDefault: VoidFunction;
  onCodeEditorToggle?: (opened: boolean) => void;
}
