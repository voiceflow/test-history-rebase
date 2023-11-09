import { z } from 'zod';

import { PromptCreateDTO } from '../prompt/prompt-create.dto';
import { ExpressionConditionDTO, PromptConditionDTO, ScriptConditionDTO } from './condition.dto';

const BasePromptConditionCreateDTO = PromptConditionDTO.pick({ type: true, turns: true }).strict();

export const PromptConditionCreateDTO = z.union([
  BasePromptConditionCreateDTO.extend(PromptConditionDTO.pick({ promptID: true }).shape),
  BasePromptConditionCreateDTO.extend({ prompt: PromptCreateDTO }),
]);

export type PromptConditionCreate = z.infer<typeof PromptConditionCreateDTO>;

export const ScriptConditionCreateDTO = ScriptConditionDTO.pick({ type: true, code: true }).strict();

export type ScriptConditionCreate = z.infer<typeof ScriptConditionCreateDTO>;

export const ExpressionConditionCreateDTO = ExpressionConditionDTO.pick({ type: true, matchAll: true }).strict();

export type ExpressionConditionCreate = z.infer<typeof ExpressionConditionCreateDTO>;

export const AnyConditionCreateDTO = z.union([
  PromptConditionCreateDTO,
  ScriptConditionCreateDTO,
  ExpressionConditionCreateDTO,
]);

export type AnyConditionCreate = z.infer<typeof AnyConditionCreateDTO>;
