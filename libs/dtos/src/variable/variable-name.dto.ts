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

export const VariableNameDTO = VariableNameTransformDTO.refine((value) => value.length > 0, 'Name is required').refine(
  (value) => value.length <= 32,
  'Name cannot exceed 32 characters'
);
