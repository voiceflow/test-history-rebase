import * as ML from '@voiceflow/ml-sdk';
import * as Platform from '@voiceflow/platform-config';
import { StrengthGaugeTypes } from '@voiceflow/ui';
import * as Normal from 'normal-store';

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
  id: string;
  deleted?: boolean;
  initialSentence: string;
  initialIntentID: string;
}

export interface Conflict {
  id: string;
  intentID: string;
  utterances: Normal.Normalized<Normal.Normalized<ConflictUtterance>>;
}

export interface MoveUtterancePayload {
  to: { index: number; intentID: string };
  from: { intentID: string; utteranceID: string };
  conflictID: string;
}

export interface DeletedUtterancePayload {
  intentID: string;
  conflictID: string;
  utteranceID: string;
}

export interface EditUtterancePayload {
  sentence: string;
  intentID: string;
  conflictID: string;
  utteranceID: string;
}
