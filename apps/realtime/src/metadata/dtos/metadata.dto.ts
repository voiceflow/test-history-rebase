import { z } from 'zod';

export const MetadataField = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
]);
export type MetadataField = z.infer<typeof MetadataField>;

export const MetadataSchema = z.record(z.string(), MetadataField);
export type MetadataSchema = z.infer<typeof MetadataSchema>;
