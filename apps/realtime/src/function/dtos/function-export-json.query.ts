import { z } from 'zod';

export const FunctionExportIDs = z.string().array().optional();

export const FunctionExportQuery = z.object({
  ids: FunctionExportIDs,
});

export type FunctionExportIDs = z.infer<typeof FunctionExportIDs>;
export type FunctionExportQuery = z.infer<typeof FunctionExportQuery>;
