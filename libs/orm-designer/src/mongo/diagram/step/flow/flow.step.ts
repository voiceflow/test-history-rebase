import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';

export const FlowStepData = z.object({
  flowID: z.string().uuid().nullable(),
});

export type FlowStepData = z.infer<typeof FlowStepData>;

export const FlowStep = Step(NodeType.STEP__FLOW__V3, FlowStepData, NodePortsWithNext);

export type FlowStep = z.infer<typeof FlowStep>;
