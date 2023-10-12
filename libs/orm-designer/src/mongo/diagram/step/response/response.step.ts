import { z } from 'zod';

import { NodePortsByKey, NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';

export const ResponsePorts = z.intersection(NodePortsWithNext, NodePortsByKey);

export type ResponsePorts = z.infer<typeof ResponsePorts>;

export const ResponseStepData = z.object({
  responseID: z.string().uuid().nullable(),
});

export type ResponseStepData = z.infer<typeof ResponseStepData>;

export const ResponseStep = Step(NodeType.STEP__RESPONSE__V3, ResponseStepData, ResponsePorts);

export type ResponseStep = z.infer<typeof ResponseStep>;
