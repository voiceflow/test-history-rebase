import { ConflictUtterance } from './types';

export const findIntentUtterances = (utterances: ConflictUtterance[], intentID: string) => {
  return utterances.filter((utterance) => utterance.intentID === intentID);
};
