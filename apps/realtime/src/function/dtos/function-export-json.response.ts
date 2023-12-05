import { FunctionDTO, FunctionPathDTO, FunctionVariableDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FunctionExportJSONResponse = z
  .object({
    functions: FunctionDTO.array(),
    functionPaths: FunctionPathDTO.array(),
    functionVariables: FunctionVariableDTO.array(),
  })
  .strict();

export type FunctionExportJSONResponse = z.infer<typeof FunctionExportJSONResponse>;
