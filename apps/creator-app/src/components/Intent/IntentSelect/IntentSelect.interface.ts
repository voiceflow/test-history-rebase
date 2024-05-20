import type { Intent } from '@voiceflow/dtos';

export interface IIntentSelect {
  editable?: boolean;
  intentID: string | null;
  onSelect: (intent: Intent) => void;
  excludeIDs?: string[];
}
