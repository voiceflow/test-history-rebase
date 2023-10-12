import type { Node } from '../node/node.interface';
import type { NodeType } from '../node/node-type.enum';
import type { Port } from '../port/port.interface';

export interface Step<Type extends NodeType, Data = null, PortMap extends Record<string, Port> | null = null>
  extends Node<Type, Data>,
    Node.Child,
    Node.Ports<PortMap> {}
