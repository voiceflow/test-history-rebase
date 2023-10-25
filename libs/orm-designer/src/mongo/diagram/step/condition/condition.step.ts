import { z } from 'zod';

import { NodePortsByKey } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';

export const ConditionStepData = z.object({
  conditions: z
    .object({
      id: z.string(),
      conditionID: z.string().nullable(),
    })
    .array(),
});

export type ConditionStepData = z.infer<typeof ConditionStepData>;

export const ConditionStep = Step(NodeType.STEP__CONDITION__V3, ConditionStepData, NodePortsByKey);

export type ConditionStep = z.infer<typeof ConditionStep>;
