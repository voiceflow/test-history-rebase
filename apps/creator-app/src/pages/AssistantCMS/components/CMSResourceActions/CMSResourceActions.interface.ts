import type { IButton } from '@voiceflow/ui-next';

export interface ICMSResourceButtonAction extends Pick<IButton, 'label' | 'onClick' | 'iconName'> {}

export interface ICMSResourceActions {
  actions: React.ReactNode;
  className?: string;
}
