import { Overwrite } from 'utility-types';

import { Link, Node, NodeData, PartialModel, Port } from '@/models';
import { Normalized } from '@/utils/normalized';

export type DiagramState = {
  diagramID: string | null;
  rootNodeIDs: string[];
  nodes: Normalized<Node>;
  links: Normalized<Link>;
  ports: Normalized<Port>;
  data: Record<string, NodeData<unknown>>;
  linksByPortID: Record<string, string[]>;
  linksByNodeID: Record<string, string[]>;
  linkedNodesByNodeID: Record<string, string[]>;
  sections: Record<string, unknown>;
  markupNodeIDs: string[];
};

export type NodeDescriptor = Overwrite<Node, { ports: Record<'in' | 'out', PartialModel<Port>[]> }>;

export type ParentNodeDescriptor = WithRequired<Partial<NodeDescriptor>, 'id' | 'ports'>;

export type DataDescriptor<T = unknown> = Omit<NodeData<T>, 'nodeID' | 'type' | 'blockColor' | 'path'>;
