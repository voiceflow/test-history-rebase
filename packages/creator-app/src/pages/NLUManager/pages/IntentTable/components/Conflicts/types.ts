export interface IntentItem {
  intentID: string;
  intentName: string;
  utterances: string[];
}

export interface Utterance {
  sentence: string;
  intentID: string;
}

export interface ConflictUtterance extends Utterance {
  initialSentence: string;
  initialIntentID: string;
  deleted?: boolean;
}

export interface Conflict {
  id: string;
  intentID: string;
  utterances: Record<string, ConflictUtterance[]>;
}

export interface MoveUtterancePayload {
  conflictID: string;
  utterance: string;
  from: {
    intentID: string;
    utterance: string;
    index: number;
  };
  to: {
    intentID: string;
    utterance: string;
    index: number;
  };
}

export interface DeletedUtterancePayload {
  conflictID: string;
  utterance: ConflictUtterance;
}

export interface EditUtterancePayload {
  conflictID: string;
  intentID: string;
  utterance: string;
  newUtteranceSentence: string;
}
