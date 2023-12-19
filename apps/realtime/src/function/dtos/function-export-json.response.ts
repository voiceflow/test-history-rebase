import { z } from 'zod';

import { FunctionExportImportDataDTO } from './function-export-import-data.dto';

export const FunctionExportJSONResponse = z.object({}).merge(FunctionExportImportDataDTO).strict();

export type FunctionExportJSONResponse = z.infer<typeof FunctionExportJSONResponse>;
