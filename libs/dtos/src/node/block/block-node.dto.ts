import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';

export const BlockNodeDataDTO = BaseNodeDataDTO.extend({
  name: z.string(),
  color: z.string(),
  steps: z.array(z.string()),
}).strict();

export type BlockNodeData = z.infer<typeof BlockNodeDataDTO>;

export const BlockNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.BLOCK),
  data: BlockNodeDataDTO,
  coords: z.tuple([z.number(), z.number()]),
}).strict();

export type BlockNode = InferNode<typeof BlockNodeDTO>;
