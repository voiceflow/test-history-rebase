export interface IKBImportIntegrationWaiting {
  onClose: VoidFunction;
  onContinue: VoidFunction;
  onFail: VoidFunction;
  disabled?: boolean;
  reconnect?: boolean;
}
