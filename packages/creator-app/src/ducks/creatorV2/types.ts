import * as Realtime from '@realtime-sdk';
import { Normalized } from '@voiceflow/common';

import { Point } from '@/types';

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
  originByNodeID: NodeLookup<Point>;

  portsByNodeID: NodeLookup<Realtime.NodePorts>;
  linkIDsByNodeID: NodeLookup<string[]>;
  blockIDByStepID: NodeLookup<string>;
  stepIDsByBlockID: NodeLookup<string[]>;

  linkIDsByPortID: PortLookup<string[]>;
  nodeIDByPortID: PortLookup<string>;

  portIDsByLinkID: LinkLookup<string[]>;
  nodeIDsByLinkID: LinkLookup<string[]>;
}
