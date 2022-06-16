import { Link } from './Link';
import { Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';
import { Viewport } from './Viewport';

export interface CreatorDiagram {
  diagramID: string;
  viewport: Viewport;
  rootNodeIDs: string[];
  nodes: Node[];
  links: Link[];
  ports: Port[];
  data: Record<string, NodeData<unknown>>;
  markupNodeIDs: string[];
}
