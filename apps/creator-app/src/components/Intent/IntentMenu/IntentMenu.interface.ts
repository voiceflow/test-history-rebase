import type { Intent } from '@voiceflow/sdk-logux-designer';

export interface IIntentMenu {
  width?: number;
  onIntentSelect: (intent: Intent) => void;
}
