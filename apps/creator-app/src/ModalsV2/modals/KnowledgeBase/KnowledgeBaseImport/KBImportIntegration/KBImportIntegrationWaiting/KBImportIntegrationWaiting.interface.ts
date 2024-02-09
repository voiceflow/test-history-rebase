export interface IKBImportIntegrationWaiting {
  onFail: VoidFunction;
  onClose: VoidFunction;
  disabled?: boolean;
  reconnect?: boolean;
  subdomain?: string;
  onContinue: VoidFunction;
}
