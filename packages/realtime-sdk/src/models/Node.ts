import { BlockType } from '../constants';
import { WithRequired } from '../types';
import { DBPort } from './Port';

export interface Node {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  parentNode: string | null;
  combinedNodes: string[];
  ports: { in: string[]; out: string[] };
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
