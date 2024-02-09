import { BaseProps } from '@voiceflow/ui-next';

export interface ICMSEditorMoreButton extends BaseProps {
  disabled?: boolean;
  children: (props: { onClose: VoidFunction }) => React.ReactNode;
}
