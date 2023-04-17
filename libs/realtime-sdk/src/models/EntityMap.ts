import { Link } from './Link';
import { Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';

export interface NodeWithData {
  node: Node;
  data: NodeData<unknown>;
}

export interface EntityMap {
  nodesWithData: NodeWithData[];
  ports: Port[];
  links: Link[];
}
