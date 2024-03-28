import type { Intent } from '@voiceflow/dtos';

export interface IIntentMenu {
  width?: number;
  header?: React.ReactNode;
  onClose: VoidFunction;
  onSelect: (intent: Intent) => void;
  viewOnly?: boolean;
}
