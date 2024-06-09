import { FunctionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { FunctionExportDataDTO } from './function-export-data.dto';

export const FunctionImportDataDTO = FunctionExportDataDTO.extend({
  functions: z.array(
    FunctionDTO.extend({
      pathOrder: FunctionDTO.shape.pathOrder.optional(),
    })
  ),
}).strict();

export type FunctionImportDataDTO = z.infer<typeof FunctionImportDataDTO>;
