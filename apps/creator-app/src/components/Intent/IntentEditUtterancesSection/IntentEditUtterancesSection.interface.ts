import { UtteranceText } from '@voiceflow/sdk-logux-designer';

export interface IIntentEditUtterancesSection {
  intentID: string;
  newUtterances?: UtteranceText[];
}
