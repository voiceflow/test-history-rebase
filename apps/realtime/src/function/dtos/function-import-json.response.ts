import { FunctionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const FunctionImportJSONResponse = z.object({
  functions: FunctionDTO.array(),
});

export type FunctionImportJSONResponse = z.infer<typeof FunctionImportJSONResponse>;
