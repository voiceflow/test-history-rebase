import { z } from 'zod';

import { NodePortsByKey } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Step } from '../step.dto';

export const RandomStepData = z.object({
  /**
   * each path is an ID which is the key for the associated port
   */
  paths: z.string().array(),
});

export type RandomStepData = z.infer<typeof RandomStepData>;

export const RandomStep = Step(NodeType.STEP__RANDOM__V3, RandomStepData, NodePortsByKey);

export type RandomStep = z.infer<typeof RandomStep>;
