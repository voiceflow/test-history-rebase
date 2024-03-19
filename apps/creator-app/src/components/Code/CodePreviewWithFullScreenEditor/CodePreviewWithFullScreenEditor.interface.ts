import { ISquareButton } from '@voiceflow/ui-next';

export interface ICodePreviewWithFullScreenEditor {
  code: string;
  testID?: string;
  disabled?: boolean;
  onCodeChange: (code: string) => void;
  isFunctionEditor?: boolean;
  headerButtonProps?: ISquareButton;
  autoFocusLineNumber?: number;
}
