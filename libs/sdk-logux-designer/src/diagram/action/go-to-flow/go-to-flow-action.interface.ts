import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Action } from '../action.interface';

export interface GoToFlowAction
  extends Action<NodeType.ACTION__GO_TO_FLOW__V3, GoToFlowAction.Data, Node.PortsWithNext> {}

export namespace GoToFlowAction {
  export interface Data extends Action.BaseData {
    flowID: string | null;
  }
}
