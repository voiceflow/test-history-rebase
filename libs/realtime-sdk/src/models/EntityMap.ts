import type { Link } from './Link';
import type { Node } from './Node';
import type { NodeData } from './NodeData';
import type { Port } from './Port';

export interface NodeWithData {
  node: Node;
  data: NodeData<unknown>;
}

export interface EntityMap {
  nodesWithData: NodeWithData[];
  ports: Port[];
  links: Link[];
}
