import { VariableType } from './constants';

const DIVIDER = ':';

export const addPrefix = (prefix: VariableType, variable: string) => `${prefix}${DIVIDER}${variable}`;

export const removePrefix = (prefixedVariable: string) => {
  const [prefix, variable] = prefixedVariable.split(DIVIDER);

  if (Object.values<string>(VariableType).includes(prefix)) {
    return variable;
  }

  return prefixedVariable;
};
