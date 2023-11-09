import type { Intent } from '@voiceflow/dtos';

export interface IIntentMenu {
  width?: number;
  onIntentSelect: (intent: Intent) => void;
}
