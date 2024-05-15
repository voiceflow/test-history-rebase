import { z } from 'zod';

export const CompiledScriptConditionDataDTO = z.object({
  code: z.string(),
});

export type CompiledScriptConditionData = z.infer<typeof CompiledScriptConditionDataDTO>;
