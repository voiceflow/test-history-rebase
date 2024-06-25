import type { Intent, UtteranceText } from '@voiceflow/dtos';

export interface IIntentEditUtterancesSection {
  intent: Intent;
  newUtterances?: UtteranceText[];
  utterancesError?: string | null;
  resetUtterancesError?: VoidFunction;
}
