import { Diagram } from '@voiceflow/api-sdk';

import { Link } from '@/models/Link';
import { Node } from '@/models/Node';
import { NodeData } from '@/models/NodeData';
import { Port } from '@/models/Port';
import { Viewport } from '@/types';

export type CreatorDiagram = {
  diagramID: string;
  viewport: Viewport;
  rootNodeIDs: string[];
  nodes: Node[];
  links: Link[];
  ports: Port[];
  data: Record<string, NodeData<unknown>>;
  markupNodeIDs: string[];
};

// we will be doing a patch request
export type DBCreatorDiagram = Omit<Diagram, 'created' | 'creatorID' | 'variables' | 'versionID' | 'name'>;
