import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';

export const MessageNodeDataDTO = BaseNodeDataDTO.extend({
  messageID: z.string().nullable(),
  draft: z.boolean(),
}).strict();

export type MessageNodeData = z.infer<typeof MessageNodeDataDTO>;

export const MessageNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.MESSAGE),
  data: MessageNodeDataDTO,
}).strict();

export type MessageNode = InferNode<typeof MessageNodeDTO>;
