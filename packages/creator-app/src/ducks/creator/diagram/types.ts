import { Normalized, WithRequired } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Overwrite } from 'utility-types';

import { DiagramState as DState } from '@/constants';
import { PartialModel } from '@/models';

export interface DiagramState {
  diagramID: string | null;
  rootNodeIDs: string[];
  nodes: Normalized<Realtime.Node>;
  links: Normalized<Realtime.Link>;
  ports: Normalized<Realtime.Port>;
  data: Record<string, Realtime.NodeData<unknown>>;
  linksByPortID: Record<string, string[]>;
  linksByNodeID: Record<string, string[]>;
  linkedNodesByNodeID: Record<string, string[]>;
  sections: Record<string, unknown>;
  markupNodeIDs: string[];
  diagramState: DState;
  hidden: boolean;
}

export type NodeDescriptor = Overwrite<Realtime.Node, { ports: Record<'in' | 'out', PartialModel<Realtime.Port>[]> }>;

export type ParentNodeDescriptor = WithRequired<Partial<NodeDescriptor>, 'id' | 'ports'>;

export type DataDescriptor<T = unknown> = Omit<Realtime.NodeData<T>, 'nodeID' | 'type' | 'blockColor' | 'path'>;
