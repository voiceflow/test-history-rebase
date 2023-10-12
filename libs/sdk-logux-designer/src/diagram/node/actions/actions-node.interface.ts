import type { Node } from '../node.interface';
import type { NodeType } from '../node-type.enum';

export interface ActionsNode extends Node<NodeType.ACTIONS__V3, ActionsNode.Data> {}

export namespace ActionsNode {
  export interface Data {
    actionIDs: string[];
  }
}
