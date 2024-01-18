import { Link } from './Link';
import { Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';
import { Viewport } from './Viewport';

export interface CreatorDiagram {
  data: Record<string, NodeData<unknown>>;
  nodes: Node[];
  links: Link[];
  ports: Port[];
  viewport: Viewport;
  rootNodeIDs: string[];
  markupNodeIDs: string[];
}
