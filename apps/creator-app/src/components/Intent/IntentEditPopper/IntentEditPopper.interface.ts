import type { Intent } from '@voiceflow/dtos';

export interface IIntentEditPopper {
  intentID: string;
  onIntentSelect: (intent: Intent) => void;
}
