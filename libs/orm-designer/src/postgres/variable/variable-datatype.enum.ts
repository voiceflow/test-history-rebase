export const VariableDatatype = {
  ANY: 'any',
  TEXT: 'text',
  DATE: 'date',
  IMAGE: 'image',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
} as const;

export type VariableDatatype = (typeof VariableDatatype)[keyof typeof VariableDatatype];
