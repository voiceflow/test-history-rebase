import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';

export interface ResponseStep extends Step<NodeType.STEP__RESPONSE__V3, ResponseStep.Data, ResponseStep.Ports> {}

export namespace ResponseStep {
  export interface Data {
    responseID: string | null;
  }

  export interface Ports extends Node.PortsWithNext, Node.PortsByKey {}
}
