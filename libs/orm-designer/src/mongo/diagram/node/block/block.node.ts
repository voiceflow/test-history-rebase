import { z } from 'zod';

import { Node, NodeCoordinates } from '../node.dto';
import { NodeType } from '../node-type.enum';

export const BlockNodeData = z.object({
  name: z.string().nullable(),
  color: z.string().nullable(),
  stepIDs: z.string().array(),
});

export type BlockNodeData = z.infer<typeof BlockNodeData>;

export const BlockNode = Node(NodeType.BLOCK__V3, BlockNodeData).merge(NodeCoordinates);

export type BlockNode = z.infer<typeof BlockNode>;
