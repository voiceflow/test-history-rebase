import { z } from 'zod';

import { CMSBaseResourceDTO, MarkupDTO } from '@/common';

import { ConditionType } from './condition-type.enum';

const BaseConditionDTO = CMSBaseResourceDTO.extend({
  type: z.nativeEnum(ConditionType),
  assistantID: z.string().optional(),
  environmentID: z.string().optional(),
}).strict();

export const PromptConditionDTO = BaseConditionDTO.extend({
  type: z.literal(ConditionType.PROMPT),
  turns: z.number(),
  promptID: z.string().nullable(),
}).strict();

export type PromptCondition = z.infer<typeof PromptConditionDTO>;

export const ScriptConditionDTO = BaseConditionDTO.extend({
  type: z.literal(ConditionType.SCRIPT),
  code: MarkupDTO,
}).strict();

export type ScriptCondition = z.infer<typeof ScriptConditionDTO>;

export const ExpressionConditionDTO = BaseConditionDTO.extend({
  type: z.literal(ConditionType.EXPRESSION),
  matchAll: z.boolean(),
}).strict();

export type ExpressionCondition = z.infer<typeof ExpressionConditionDTO>;

export const AnyConditionDTO = z.union([PromptConditionDTO, ScriptConditionDTO, ExpressionConditionDTO]);

export type AnyCondition = z.infer<typeof AnyConditionDTO>;
