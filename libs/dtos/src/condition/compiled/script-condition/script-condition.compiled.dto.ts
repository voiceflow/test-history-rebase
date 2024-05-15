import { z } from 'zod';

import { ConditionType } from '../../condition-type.enum';
import { BaseCompiledConditionDTO } from '../base-condition.compiled.dto';
import { CompiledScriptConditionDataDTO } from './script-condition-data.compiled.dto';

export const CompiledScriptConditionDTO = BaseCompiledConditionDTO.extend({
  type: z.literal(ConditionType.SCRIPT),
  data: CompiledScriptConditionDataDTO,
}).strict();

export type CompiledScriptCondition = z.infer<typeof CompiledScriptConditionDTO>;
