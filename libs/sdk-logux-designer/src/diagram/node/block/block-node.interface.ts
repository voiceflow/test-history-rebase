import type { Node } from '../node.interface';
import type { NodeType } from '../node-type.enum';

export interface BlockNode extends Node<NodeType.BLOCK__V3, BlockNode.Data>, Node.Coordinates {}

export namespace BlockNode {
  export interface Data {
    name: string | null;
    color: string | null;
    stepIDs: string[];
  }
}
