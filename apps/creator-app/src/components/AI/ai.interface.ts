import type { EntityVariant, TextResponseVariant, Utterance } from '@voiceflow/sdk-logux-designer';

export interface AIGenerateUtterance extends Pick<Utterance, 'text'> {}

export interface AIGenerateEntityVariant extends Pick<EntityVariant, 'value' | 'synonyms'> {}

export interface AIGenerateTextResponseVariant extends Pick<TextResponseVariant, 'text'> {}
