import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';
import type { ManualAssignment, PromptAssignment } from '@/diagram/step/set/assignment/assignment.interface';

import type { Action } from '../action.interface';

export interface SetVariableAction
  extends Action<NodeType.ACTION__SET_VARIABLE__V3, SetVariableAction.Data, Node.PortsWithNext> {}

export namespace SetVariableAction {
  export interface Data extends Action.BaseData {
    assignment: Omit<ManualAssignment, 'id'> | Omit<PromptAssignment, 'id'>;
  }
}
