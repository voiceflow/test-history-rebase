import { UtteranceText } from '@voiceflow/dtos';

export interface IIntentEditForm {
  intentID: string;
  newUtterances?: UtteranceText[];
}
