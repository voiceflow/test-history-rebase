import type { Intent } from '@voiceflow/dtos';

export interface IIntentMenu {
  width?: number;
  onClose: VoidFunction;
  onSelect: (intent: Intent) => void;
}
