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
