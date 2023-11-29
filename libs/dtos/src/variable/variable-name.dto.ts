import { z } from 'zod';

/**
 * Doesn't have any validations, just transforms the value
 */
export const VariableNameTransformDTO = z.string().transform((value) =>
  value
    .replace(/[^\w $]/g, '')
    .replace(/^[^A-Za-z]+/g, '')
    .replace(/\s\s+|\s/g, '_')
    .trim()
);
