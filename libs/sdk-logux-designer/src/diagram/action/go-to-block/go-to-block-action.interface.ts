import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Action } from '../action.interface';

export interface GoToBlockAction
  extends Action<NodeType.ACTION__GO_TO_BLOCK__V3, GoToBlockAction.Data, Node.PortsWithNext> {}

export namespace GoToBlockAction {
  export interface Data extends Action.BaseData {
    block: {
      diagramID: string;
      nodeID: string;
    } | null;
  }
}
