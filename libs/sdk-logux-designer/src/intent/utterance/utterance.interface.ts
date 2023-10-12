import type { Language, ObjectResource } from '@/common';

interface UtteranceSpan {
  text: UtteranceText;
  attributes?: Record<string, unknown>;
}

export type UtteranceText = Array<string | { entityID: string } | UtteranceSpan>;

interface UtteranceData {
  text: UtteranceText;
  language: Language;
}

export interface Utterance extends ObjectResource, UtteranceData {
  intentID: string;
  assistantID: string;
}

export interface UtteranceCreateData extends UtteranceData {}
