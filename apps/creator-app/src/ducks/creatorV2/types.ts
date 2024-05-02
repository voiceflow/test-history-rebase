import type { Normalized, WithRequired } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import type { Overwrite } from 'utility-types';

import type { Point } from '@/types';

import type * as DiagramsHistory from './diagramsHistory';
import type * as Focus from './focus';

export type NodeDescriptor = Overwrite<Realtime.Node, { ports: Realtime.PortsDescriptor }>;

export type ParentNodeDescriptor = WithRequired<Partial<NodeDescriptor>, 'id' | 'ports'>;

export type DataDescriptor<T = unknown> = Omit<Realtime.NodeData<T>, 'nodeID' | 'type' | 'blockColor' | 'path'>;

export interface NodeLookup<T> {
  [nodeID: string]: T | undefined;
}

export interface PortLookup<T> {
  [portID: string]: T | undefined;
}

export interface LinkLookup<T> {
  [linkID: string]: T | undefined;
}

export interface CreatorState {
  activeDiagramID: string | null;

  nodes: Normalized<Realtime.NodeData<unknown>>;
  ports: Normalized<Realtime.Port>;
  links: Normalized<Realtime.Link>;

  blockIDs: string[];
  markupIDs: string[];
  actionsIDs: string[];
  coordsByNodeID: NodeLookup<Point>;

  portsByNodeID: NodeLookup<Realtime.NodePorts>;
  linkIDsByNodeID: NodeLookup<string[]>;
  parentNodeIDByStepID: NodeLookup<string>;
  stepIDsByParentNodeID: NodeLookup<string[]>;

  linkIDsByPortID: PortLookup<string[]>;
  nodeIDByPortID: PortLookup<string>;

  portIDsByLinkID: LinkLookup<string[]>;
  nodeIDsByLinkID: LinkLookup<string[]>;
}

export interface FullCreatorState extends CreatorState {
  [Focus.FOCUS_STATE_KEY]: Focus.FocusState;
  [DiagramsHistory.DIAGRAMS_HISTORY_STATE_KEY]: DiagramsHistory.DiagramsHistoryState;
}
