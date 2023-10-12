import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';

export interface RandomStep extends Step<NodeType.STEP__RANDOM__V3, RandomStep.Data, Node.PortsByKey> {}

export namespace RandomStep {
  export interface Data {
    paths: string[];
  }
}
