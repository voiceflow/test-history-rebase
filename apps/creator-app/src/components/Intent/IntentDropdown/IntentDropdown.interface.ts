import type { Intent } from '@voiceflow/dtos';

export interface IIntentDropdown {
  editable?: boolean;
  intentID: string | null;
  onIntentSelect: (intent: Intent) => void;
}
