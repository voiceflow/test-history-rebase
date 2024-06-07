import { FunctionDTO, FunctionPathDTO, FunctionVariableDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FunctionExportDataDTO = z
  .object({
    functions: FunctionDTO.array(),
    functionPaths: FunctionPathDTO.array(),
    functionVariables: FunctionVariableDTO.array(),
  })
  .strict();

export type FunctionExportDataDTO = z.infer<typeof FunctionExportDataDTO>;

export const FunctionImportDataDTO = FunctionExportDataDTO.extend({
  functions: z.array(
    FunctionDTO.extend({
      pathOrder: FunctionDTO.shape.pathOrder.optional().default([])
    })
  )
}).strict();

export type FunctionImportDataDTO = z.infer<typeof FunctionImportDataDTO>;
