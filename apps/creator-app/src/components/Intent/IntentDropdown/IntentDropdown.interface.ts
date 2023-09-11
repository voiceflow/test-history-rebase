import type { Intent } from '@voiceflow/sdk-logux-designer';

export interface IIntentDropdown {
  editable?: boolean;
  intentID: string | null;
  onIntentSelect: (intent: Intent) => void;
}
