export const VariableDatatype = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  IMAGE: 'image',
} as const;

export type VariableDatatype = (typeof VariableDatatype)[keyof typeof VariableDatatype];
