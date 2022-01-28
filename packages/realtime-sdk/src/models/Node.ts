import { BlockType } from '@realtime-sdk/constants';
import { Models } from '@voiceflow/base-types';
import { WithRequired } from '@voiceflow/common';

import { DBPort, Port } from './Port';
import { PartialModel } from './Utility';

export type BuiltInPortRecord<T = string> = { [key in Models.PortType]?: T };

export interface NodePortSchema<T, O extends BuiltInPortRecord<T> = BuiltInPortRecord<T>> {
  in: T[];
  out: {
    dynamic: T[];
    builtIn: O;
  };
}

export type NodePorts<O extends BuiltInPortRecord = BuiltInPortRecord> = NodePortSchema<string, O>;

export type PortsDescriptor = NodePortSchema<Omit<PartialModel<Port>, 'nodeID'>>;

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
