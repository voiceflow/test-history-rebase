export const VariableDatatype = {
  ANY: 'any',
  TEXT: 'text',
  DATE: 'date',
  IMAGE: 'image',
  NUMBER: 'number',
  BOOLEAN: 'boolean',

  /** @deprecated replace after function test call migrated over */
  STRING: 'string',
} as const;

export type VariableDatatype = (typeof VariableDatatype)[keyof typeof VariableDatatype];
