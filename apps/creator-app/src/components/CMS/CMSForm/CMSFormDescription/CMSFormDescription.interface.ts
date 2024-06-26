import type { BaseProps } from '@voiceflow/ui-next';

export interface ICMSFormDescription extends BaseProps {
  value: string;
  error?: string | null;
  testID?: string;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  placeholder: string;
  onValueChange: (value: string) => void;
}
