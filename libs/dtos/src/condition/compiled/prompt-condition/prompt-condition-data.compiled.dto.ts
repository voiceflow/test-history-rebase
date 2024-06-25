import { z } from 'zod';

import { CompiledConditionPredicateDTO } from '@/condition/condition-predicate/condition-predicate.compiled.dto';
import { CompiledPromptDTO } from '@/prompt/prompt.compiled.dto';

export const CompiledPromptConditionDataDTO = z.object({
  turns: z.number(),
  prompt: CompiledPromptDTO,
  assertions: z.array(CompiledConditionPredicateDTO),
});

export type CompiledPromptConditionData = z.infer<typeof CompiledPromptConditionDataDTO>;
