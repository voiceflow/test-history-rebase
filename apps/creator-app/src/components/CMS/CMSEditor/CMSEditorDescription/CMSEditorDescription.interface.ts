import type { BaseProps } from '@voiceflow/ui-next';

export interface ICMSEditorDescription extends BaseProps {
  value: string;
  placeholder: string;
  showDivider?: boolean;
  onValueChange: (value: string) => void;
}
