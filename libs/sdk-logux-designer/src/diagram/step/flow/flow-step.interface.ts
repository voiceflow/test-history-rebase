import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';

export interface FlowStep extends Step<NodeType.STEP__FLOW__V3, FlowStep.Data, Node.PortsWithNext> {}

export namespace FlowStep {
  export interface Data {
    flowID: string | null;
  }
}
