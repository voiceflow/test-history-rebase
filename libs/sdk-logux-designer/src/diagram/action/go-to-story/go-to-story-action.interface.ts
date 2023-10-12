import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Action } from '../action.interface';

export interface GoToStoryAction
  extends Action<NodeType.ACTION__GO_TO_STORY__V3, GoToStoryAction.Data, Node.PortsWithNext> {}

export namespace GoToStoryAction {
  export interface Data extends Action.BaseData {
    storyID: string | null;
  }
}
