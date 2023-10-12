import type { Markup } from '@/common';
import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Step } from '../step.interface';

export interface FunctionStep extends Step<NodeType.STEP__FUNCTION__V3, FunctionStep.Data, FunctionStep.Ports> {}

export namespace FunctionStep {
  export interface Data {
    functionID: string | null;
    inputMapping: Record<string, Markup | null>;
    outputMapping: Record<string, string | null>;
  }

  export interface Ports extends Node.PortsWithNext, Node.PortsByKey {}
}
