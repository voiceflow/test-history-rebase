import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';

export interface ConditionStep extends Step<NodeType.STEP__CONDITION__V3, ConditionStep.Data, Node.PortsByKey> {}

export namespace ConditionStep {
  export interface Data {
    conditions: Condition[];
  }

  export interface Condition {
    id: string;
    conditionID: string | null;
  }
}
