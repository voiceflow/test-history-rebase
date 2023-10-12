import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';
import type { AnyAssignment } from './assignment/assignment.interface';

export interface SetStep extends Step<NodeType.STEP__SET__V3, SetStep.Data, Node.PortsWithNext> {}

export namespace SetStep {
  export interface Data {
    assignments: AnyAssignment[];
  }
}
