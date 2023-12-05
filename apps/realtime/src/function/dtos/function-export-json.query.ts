import { z } from 'zod';

export const FunctionExportJSONQuery = z.object({
  ids: z.string().array().optional(),
});

export type FunctionExportJSONQuery = z.infer<typeof FunctionExportJSONQuery>;
