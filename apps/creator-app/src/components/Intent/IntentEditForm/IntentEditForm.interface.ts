import { Intent, UtteranceText } from '@voiceflow/dtos';

export interface IIntentEditForm {
  intent: Intent;
  newUtterances?: UtteranceText[];
  utterancesError?: string | null;
  resetUtterancesError?: () => void;
}
