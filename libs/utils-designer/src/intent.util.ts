import type { Entity, Intent, Utterance, Variable } from '@voiceflow/dtos';
import { IntentDTO } from '@voiceflow/dtos';

import { isMarkupEmpty } from './markup.util';
import { composeValidators, validatorFactory, validatorZodFactory } from './validator/validator.util';

export const isDefaultIntentName = (name?: string | null) => !name || name.toLowerCase().startsWith('intent');

export const intentNameSpellingValidator = validatorZodFactory(IntentDTO.shape.name);

export const intentNameUniqIntentsValidator = validatorFactory(
  (name: string, { intents, intentID }: { intents: Intent[]; intentID: string | null }) =>
    intents.every((intent) => intent.id === intentID || intent.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  (name) => `The '${name}' intent already exists.`
);

export const intentNameUniqEntitiesValidator = validatorFactory(
  (name: string, { entities }: { entities: Entity[] }) =>
    entities.every((entity) => entity.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  () => 'Intent name already exists.'
);

export const intentNameUniqVariablesValidator = validatorFactory(
  (name: string, { variables }: { variables: Variable[] }) =>
    variables.every((variable) => variable.name.toLocaleLowerCase() !== name.toLocaleLowerCase()),
  (name) => `You have a variable defined with the '${name}' name already. Intent/Variable/Entity name must be unique.`
);

export const intentNameValidator = composeValidators(
  intentNameSpellingValidator,
  intentNameUniqIntentsValidator,
  intentNameUniqEntitiesValidator,
  intentNameUniqVariablesValidator
);

export const intentUtterancesValidator = validatorFactory(
  (utterances: Pick<Utterance, 'id' | 'text'>[], { isBuiltInIntent }: { isBuiltInIntent?: boolean }) =>
    isBuiltInIntent || utterances.some(({ text }) => !isMarkupEmpty(text)),
  'Intent requires at least 1 sample phrase.'
);

export const intentDescriptionValidator = validatorFactory(
  (
    description: string,
    { isBuiltInIntent, isLLMClassification }: { isBuiltInIntent?: boolean; isLLMClassification: boolean }
  ) => !isLLMClassification || isBuiltInIntent || !!description.trim(),
  'Description is required for LLM classification.'
);
