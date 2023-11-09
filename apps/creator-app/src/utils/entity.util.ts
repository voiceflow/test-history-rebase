import type { EntityVariant } from '@voiceflow/dtos';

export const isDefaultEntityName = (name?: string | null) => !name || name.toLowerCase().startsWith('entity');

export const isEntityVariantLikeEmpty = ({ value, synonyms }: Pick<EntityVariant, 'value' | 'synonyms'>) =>
  !value.trim() && synonyms.every((synonym) => !synonym.trim());
