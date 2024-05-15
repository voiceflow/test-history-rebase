import { z } from 'zod';

import { ConditionType } from '../../condition-type.enum';
import { BaseCompiledConditionDTO } from '../base-condition.compiled.dto';
import { CompiledExpressionConditionDataDTO } from './expression-condition-data.compiled.dto';

export const CompiledExpressionConditionDTO = BaseCompiledConditionDTO.extend({
  type: z.literal(ConditionType.EXPRESSION),
  data: CompiledExpressionConditionDataDTO,
}).strict();

export type CompiledExpressionCondition = z.infer<typeof CompiledExpressionConditionDTO>;
