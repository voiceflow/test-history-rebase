import { FunctionDTO, FunctionPathDTO, FunctionVariableDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FunctionExportImportDataDTO = z
  .object({
    functions: FunctionDTO.array(),
    functionPaths: FunctionPathDTO.array(),
    functionVariables: FunctionVariableDTO.array(),
  })
  .strict();

export type FunctionExportImportDataDTO = z.infer<typeof FunctionExportImportDataDTO>;
