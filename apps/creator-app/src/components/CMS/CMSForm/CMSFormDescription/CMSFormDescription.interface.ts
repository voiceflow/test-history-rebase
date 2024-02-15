import { BaseProps } from '@voiceflow/ui-next';

export interface ICMSFormDescription extends BaseProps {
  value: string;
  error?: string | null;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  placeholder: string;
  className?: string;
  onValueChange: (value: string) => void;
}
