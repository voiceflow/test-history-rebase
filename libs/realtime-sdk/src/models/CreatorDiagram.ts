import type { Link } from './Link';
import type { Node } from './Node';
import type { NodeData } from './NodeData';
import type { Port } from './Port';
import type { Viewport } from './Viewport';

export interface CreatorDiagram {
  data: Record<string, NodeData<unknown>>;
  nodes: Node[];
  links: Link[];
  ports: Port[];
  viewport: Viewport;
  rootNodeIDs: string[];
  markupNodeIDs: string[];
}
