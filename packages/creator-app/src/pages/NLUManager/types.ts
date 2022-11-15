import * as ML from '@voiceflow/ml-sdk';
import * as Platform from '@voiceflow/platform-config';
import { StrengthGaugeTypes } from '@voiceflow/ui';

export type ProblematicSentence = ML.Intent.Clarity.ProblematicSentence;

export interface ClarityModel extends ML.intent.ClarityModelResponse {}

export interface NLUIntent extends Platform.Base.Models.Intent.Model {
  clarity: number;
  hasErrors: boolean;
  confidence: number;
  clarityLevel: StrengthGaugeTypes.Level;
  hasConflicts: boolean;
  hasEntityError: boolean;
  confidenceLevel: StrengthGaugeTypes.Level;
  conflictingIntentIDs: string[];
  conflictingUtterances: string[];
}

export enum IntentNotificationTypes {
  ENTITY_PROMPT = 'entityPrompt',
  CONFIDENCE = 'confidence',
  CLARITY = 'clarity',
}

export interface IntentNotification {
  type: IntentNotificationTypes;
  intent: NLUIntent;
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
