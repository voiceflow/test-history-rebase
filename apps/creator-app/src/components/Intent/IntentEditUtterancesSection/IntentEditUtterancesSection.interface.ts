import { UtteranceText } from '@voiceflow/dtos';

export interface IIntentEditUtterancesSection {
  intentID: string;
  newUtterances?: UtteranceText[];
}
