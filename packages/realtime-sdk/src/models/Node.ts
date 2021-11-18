import { BlockType } from '@realtime-sdk/constants';
import { Models } from '@voiceflow/base-types';
import { WithRequired } from '@voiceflow/common';

import { DBPort } from './Port';

export type BuiltInPortRecord = { [key in Models.PortType]?: string };

export interface NodePorts<O extends BuiltInPortRecord = BuiltInPortRecord> {
  in: string[];
  out: {
    dynamic: string[];
    builtIn: O;
  };
}

export interface Node<O extends BuiltInPortRecord = BuiltInPortRecord> {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  ports: NodePorts<O>;
  parentNode: string | null;
  combinedNodes: string[];
}

export interface DBNode {
  id: string;
  name: string;
  x?: number;
  y?: number;
  ports: DBPort[];
  combines?: DBNode[] | null;
  parentNode?: string;
  extras: DBNode.Extras;
}

export namespace DBNode {
  export type WithCoords = WithRequired<DBNode, 'x' | 'y'>;

  export interface Extras {
    type: string;
    virtualExtras?: VirtualExtras;
    [key: string]: any;
  }

  export interface VirtualExtras {
    color?: string;
    name?: string;
    id?: string;
    inPortID?: string;
    reusePorts?: boolean;
  }
}
