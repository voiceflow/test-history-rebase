import { z } from 'zod';

import { BaseNodeDataPathDTO } from './base-node-data-path.dto';

export const BaseNodeDataAutomaticRepromptRuleDTO = z
  .object({
    id: z.string(),
    text: z.string(),
  })
  .strict();

export type BaseNodeDataAutomaticRepromptRule = z.infer<typeof BaseNodeDataAutomaticRepromptRuleDTO>;

export const BaseNodeDataAutomaticRepromptExitScenariosItemDTO = z.object({
  id: z.string(),
  text: z.string(),
});

export type BaseNodeDataAutomaticRepromptExitScenariosItem = z.infer<
  typeof BaseNodeDataAutomaticRepromptExitScenariosItemDTO
>;

export const BaseNodeDataAutomaticRepromptExitScenariosDTO = BaseNodeDataPathDTO.extend({
  items: z.array(BaseNodeDataAutomaticRepromptExitScenariosItemDTO),
});

export type BaseNodeDataAutomaticRepromptExitScenarios = z.infer<typeof BaseNodeDataAutomaticRepromptExitScenariosDTO>;

export const BaseNodeDataAutomaticRepromptDTO = z
  .object({
    rules: z.array(BaseNodeDataAutomaticRepromptRuleDTO).nullable().optional(),
    exitScenarios: z.nullable(BaseNodeDataAutomaticRepromptExitScenariosDTO).optional(),
  })
  .strict();

export type BaseNodeDataAutomaticReprompt = z.infer<typeof BaseNodeDataAutomaticRepromptDTO>;
