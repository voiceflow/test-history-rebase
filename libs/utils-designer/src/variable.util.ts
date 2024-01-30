import type { Entity, Intent, Variable } from '@voiceflow/dtos';
import { SystemVariable, VariableDTO } from '@voiceflow/dtos';

import { composeValidators, validatorFactory, validatorZodFactory } from './validator/validator.util';

export const isSystemVariableName = (variableName: string): variableName is SystemVariable =>
  Object.values(SystemVariable).includes(variableName as SystemVariable);

export const variableNameSpellingValidator = validatorZodFactory(VariableDTO.shape.name);

export const variableNameUniqVariablesValidator = validatorFactory(
  (name: string, { variables, variableID }: { variables: Variable[]; variableID: string | null }) =>
    variables.every((variable) => variable.id === variableID || variable.name !== name),
  () => `Variable name already exists.`
);

export const variableNameUniqEntitiesValidator = validatorFactory(
  (name: string, { entities }: { entities: Entity[] }) => entities.every((entity) => entity.name !== name),
  () => `Entity name already exists.`
);

export const variableNameUniqIntentsValidator = validatorFactory(
  (name: string, { intents }: { intents: Intent[] }) => intents.every((intent) => intent.name !== name),
  () => `Intent name already exists.`
);

export const variableNameValidator = composeValidators(
  variableNameSpellingValidator,
  variableNameUniqVariablesValidator,
  variableNameUniqEntitiesValidator,
  variableNameUniqIntentsValidator
);
