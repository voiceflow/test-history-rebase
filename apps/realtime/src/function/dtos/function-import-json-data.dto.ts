import { FunctionDTO, FunctionPathDTO, FunctionVariableDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FunctionImportJSONDataDTO = z
  .object({
    functions: FunctionDTO.array(),
    functionPaths: FunctionPathDTO.array(),
    functionVariables: FunctionVariableDTO.array(),
  })
  .strict();

export type FunctionImportJSONDataDTO = z.infer<typeof FunctionImportJSONDataDTO>;
