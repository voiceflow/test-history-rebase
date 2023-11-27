import { CUSTOM_SLOT_TYPE } from '@voiceflow/common';
import type { Entity, EntityVariant, Intent, Variable } from '@voiceflow/dtos';
import { VariableNameDTO } from '@voiceflow/dtos';

import { composeValidators, validatorFactory, validatorZodFactory } from './validator/validator.util';

export const isDefaultEntityName = (name?: string | null) => !name || name.toLowerCase().startsWith('entity');

export const isEntityVariantLikeEmpty = ({ value, synonyms }: Pick<EntityVariant, 'value' | 'synonyms'>) =>
  !value.trim() && synonyms.every((synonym) => !synonym.trim());

export const entityNameSpellingValidator = validatorZodFactory(VariableNameDTO);

export const entityNameUniqEntitiesValidator = validatorFactory(
  (name: string, { entities, entityID }: { entities: Entity[]; entityID: string | null }) =>
    entities.every((entity) => entity.id === entityID || entity.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  (name) => `The '${name}' entity already exists.`
);

export const entityNameUniqVariablesValidator = validatorFactory(
  (name: string, { variables }: { variables: Variable[] }) =>
    variables.every((variable) => variable.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  (name) => `You have a variable defined with the '${name}' name already. Entity/Variable/Intent name must be unique.`
);

export const entityNameUniqIntentsValidator = validatorFactory(
  (name: string, { intents }: { intents: Intent[] }) =>
    intents.every((intent) => intent.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  (name) => `You have an intent defined with the '${name}' name already. Entity/Intent/Variable name must be unique.`
);

export const entityNameValidator = composeValidators(
  entityNameSpellingValidator,
  entityNameUniqEntitiesValidator,
  entityNameUniqVariablesValidator,
  entityNameUniqIntentsValidator
);

export const entityVariantsValidator = validatorFactory(
  (variants: Pick<EntityVariant, 'value' | 'synonyms'>[], { classifier }: { classifier: string | null }) =>
    classifier !== CUSTOM_SLOT_TYPE || variants.some(({ value }) => value.trim().length),
  'Custom entities require at least one value.'
);
