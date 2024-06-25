import { VARIABLE_NAME_MAX_LENGTH, VariableNameTransformDTO } from '@voiceflow/dtos';

export const transformVariableName = (variable: string): string =>
  VariableNameTransformDTO.parse(variable).slice(0, VARIABLE_NAME_MAX_LENGTH);
