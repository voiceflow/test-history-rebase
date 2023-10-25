import { UtteranceText } from '@voiceflow/sdk-logux-designer';

export interface IIntentEditForm {
  intentID: string;
  newUtterances?: UtteranceText[];
}
