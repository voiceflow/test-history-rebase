import type { Language, ObjectResource } from '@/common';

interface UtteranceSpan {
  text: UtteranceText;
  attributes?: Record<string, unknown>;
}

export type UtteranceText = Array<string | { entityID: string } | UtteranceSpan>;

export interface Utterance extends ObjectResource {
  text: UtteranceText;
  language: Language;
  intentID: string;
  assistantID: string;
  environmentID: string;
}

export interface UtteranceCreateData extends Pick<Utterance, 'text' | 'language'> {}
