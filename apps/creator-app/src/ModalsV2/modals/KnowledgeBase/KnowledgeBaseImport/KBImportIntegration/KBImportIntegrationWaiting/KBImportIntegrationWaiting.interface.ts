import type { BaseProps } from '@voiceflow/ui-next';

export interface IKBImportIntegrationWaiting extends BaseProps {
  onFail: VoidFunction;
  onClose: VoidFunction;
  disabled?: boolean;
  reconnect?: boolean;
  subdomain?: string;
  onContinue: VoidFunction;
}
