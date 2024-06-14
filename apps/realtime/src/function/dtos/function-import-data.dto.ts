import { FunctionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { FunctionExportDataDTO } from './function-export-data.dto';

export const FunctionImportDTO = FunctionDTO.extend({
  pathOrder: FunctionDTO.shape.pathOrder.optional(),
});
export type FunctionImportDTO = z.infer<typeof FunctionImportDTO>;

export const FunctionImportDataDTO = FunctionExportDataDTO.extend({
  functions: z.array(FunctionImportDTO),
}).strict();

export type FunctionImportDataDTO = z.infer<typeof FunctionImportDataDTO>;
