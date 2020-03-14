import { BlockType } from '@/constants';

export type Node = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  parentNode: string | null;
  combinedNodes: string[];
  ports: { in: string[]; out: string[] };
};

export type DBNode = {};
