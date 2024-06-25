import type { Intent } from '@voiceflow/dtos';

export interface IIntentMenuEmpty {
  width?: number;
  onCreated?: (intent: Intent) => void;
}
