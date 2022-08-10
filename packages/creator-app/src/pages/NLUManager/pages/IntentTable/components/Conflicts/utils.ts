import { ConflictUtterance } from '@/pages/NLUManager/types';

export const findIntentUtterances = (utterances: ConflictUtterance[], intentID: string) => {
  return utterances.filter((utterance) => utterance.intentID === intentID);
};
