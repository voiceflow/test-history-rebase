import { z } from 'zod';

import { CompiledFunctionDefinitionDTO } from '../../../function/compiled/function-definition.compiled.dto';

export const CompiledFunctionLegacyReferenceDTO = CompiledFunctionDefinitionDTO.describe(
  '[Deprecated]: an embedding of the function definition into a compiled function node'
);

export type CompiledFunctionLegacyReference = z.infer<typeof CompiledFunctionLegacyReferenceDTO>;

export const CompiledFunctionReferenceDTO = z
  .object({
    functionId: z.string().describe('ID of function being referenced'),
  })
  .strict();

export type CompiledFunctionReference = z.infer<typeof CompiledFunctionReferenceDTO>;
