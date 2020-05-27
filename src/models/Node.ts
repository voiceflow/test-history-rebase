import { BlockType } from '@/constants';

import { DBPort } from './Port';

export type Node = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  parentNode: string | null;
  combinedNodes: string[];
  ports: { in: string[]; out: string[] };
};

export type DBNode = {
  id: string;
  name: string;
  x?: number;
  y?: number;
  ports: DBPort[];
  combines?: DBNode[] | null;
  parentNode?: string;
  extras: {
    type: string;
    virtualExtras?: {
      color?: string;
      name?: string;
      id?: string;
      inPortID?: string;
    };
    [key: string]: any;
  };
};
