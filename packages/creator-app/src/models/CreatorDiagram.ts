import { Viewport } from '@/types';

import { DBLink, Link } from './Link';
import { DBNode, Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';

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

export interface DBCreatorDiagram {
  id: string;
  offsetX: number;
  offsetY: number;
  zoom: number;
  links: DBLink[];
  nodes: DBNode[];
  blockRedesignOffset: boolean;
}
