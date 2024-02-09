import { BaseProps } from '@voiceflow/ui-next';

export interface IKBImportIntegrationZendesk extends BaseProps {
  onClose: VoidFunction;
  disabled?: boolean;
  onSuccess: VoidFunction;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
}
