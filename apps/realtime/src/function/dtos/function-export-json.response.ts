import { z } from 'zod';

import { FunctionExportDataDTO } from './function-export-import-data.dto';

export const FunctionExportJSONResponse = z.object({}).merge(FunctionExportDataDTO).strict();

export type FunctionExportJSONResponse = z.infer<typeof FunctionExportJSONResponse>;
