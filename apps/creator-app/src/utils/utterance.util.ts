import type { Entity, Utterance, UtteranceText } from '@voiceflow/dtos';
import type { MultiAdapter } from 'bidirectional-adapter';
import { createMultiAdapter } from 'bidirectional-adapter';
import type { Descendant } from 'slate';

import { isMarkupEmpty, markupToSlate, markupToString } from './markup.util';

export const utteranceTextFactory = (text = ''): UtteranceText => [text];

export const isUtteranceTextEmpty = (utteranceText: UtteranceText): boolean => isMarkupEmpty(utteranceText);

export const isUtteranceLikeEmpty = (utterance: Pick<Utterance, 'text'>): boolean => isUtteranceTextEmpty(utterance.text);

interface UtteranceTextToStringFromOptions {
  entitiesMapByID: Partial<Record<string, Entity>>;
  ignoreMissingEntities?: boolean;
}

interface UtteranceTextToStringToOptions {
  entitiesMapByName: Partial<Record<string, Entity>>;
}

export const utteranceTextToString: MultiAdapter<UtteranceText, string, [UtteranceTextToStringFromOptions], [UtteranceTextToStringToOptions]> =
  createMultiAdapter<UtteranceText, string, [UtteranceTextToStringFromOptions], [UtteranceTextToStringToOptions]>(
    (value, options) => markupToString.fromDB(value, { ...options, variablesMapByID: {}, ignoreMissingVariables: true }),
    (value, options) => markupToString.toDB(value, { ...options, variablesMapByName: {} }) as UtteranceText
  );

export const utteranceTextToSlate: MultiAdapter<UtteranceText, Descendant[]> = createMultiAdapter<UtteranceText, Descendant[]>(
  (value) => markupToSlate.fromDB(value),
  (value) => markupToSlate.toDB(value) as UtteranceText
);
