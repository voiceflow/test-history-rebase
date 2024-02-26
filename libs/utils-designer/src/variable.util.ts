import type { Entity, Intent, Variable } from '@voiceflow/dtos';
import { SYSTEM_VARIABLE_TYPE_MAP, SystemVariable, VariableDatatype, VariableDTO } from '@voiceflow/dtos';

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

export interface VariableDeclaration {
  isArray?: boolean;
  isSystem: boolean;
  datatype?: VariableDatatype;
  defaultValue: string | null;
}

export const parseVariableDefaultValue = (name: string, { datatype, isSystem, defaultValue }: VariableDeclaration) => {
  if (!defaultValue) return defaultValue;

  const type = isSystem && isSystemVariableName(name) ? SYSTEM_VARIABLE_TYPE_MAP[name] : datatype;

  switch (type) {
    case VariableDatatype.BOOLEAN:
      return defaultValue.toLowerCase() === 'true';
    case VariableDatatype.DATE:
      return new Date(defaultValue);
    case VariableDatatype.NUMBER:
      return parseFloat(defaultValue);
    case VariableDatatype.TEXT:
    case VariableDatatype.IMAGE:
    case VariableDatatype.ANY:
      return defaultValue;
    default:
      throw new Error(`Received unexpected variable type '${type}'`);
  }
};

/**
 * @deprecated use parseVariableDefaultValue instead
 */
export const parseCMSVariableDefaultValue = parseVariableDefaultValue;
