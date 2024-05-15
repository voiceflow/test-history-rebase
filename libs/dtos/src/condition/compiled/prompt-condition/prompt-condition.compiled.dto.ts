import { z } from 'zod';

import { ConditionType } from '../../condition-type.enum';
import { BaseCompiledConditionDTO } from '../base-condition.compiled.dto';
import { CompiledPromptConditionDataDTO } from './prompt-condition-data.compiled.dto';

export const CompiledPromptConditionDTO = BaseCompiledConditionDTO.extend({
  type: z.literal(ConditionType.PROMPT),
  data: CompiledPromptConditionDataDTO,
}).strict();

export type CompiledPromptCondition = z.infer<typeof CompiledPromptConditionDTO>;
