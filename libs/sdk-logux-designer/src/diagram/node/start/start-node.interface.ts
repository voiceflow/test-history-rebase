import type { Node } from '../node.interface';
import type { NodeType } from '../node-type.enum';

export interface StartNode
  extends Node<NodeType.START__V3, StartNode.Data>,
    Node.Coordinates,
    Node.Ports<Node.PortsWithNext> {}

export namespace StartNode {
  export interface Data {
    label: string;
  }
}
