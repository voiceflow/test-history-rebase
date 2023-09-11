import type { Intent } from '@voiceflow/sdk-logux-designer';

export interface IIntentEditPopper {
  intentID: string;
  onIntentSelect: (intent: Intent) => void;
}
