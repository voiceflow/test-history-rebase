import { z } from 'zod';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';
import { ManualAssignment, PromptAssignment } from './assignment/assignment.dto';

export const SetStepData = z.object({
  assignments: z.array(z.discriminatedUnion('type', [ManualAssignment, PromptAssignment])),
});

export type SetStepData = z.infer<typeof SetStepData>;

export const SetStep = Step(NodeType.STEP__SET__V3, SetStepData, NodePortsWithNext);

export type SetStep = z.infer<typeof SetStep>;
