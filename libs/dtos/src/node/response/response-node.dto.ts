import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';

export const ResponseNodeDataDTO = BaseNodeDataDTO.extend({
  responseID: z.string().nullable(),
}).strict();

export type ResponseNodeData = z.infer<typeof ResponseNodeDataDTO>;

export const ResponseNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.RESPONSE),
  data: ResponseNodeDataDTO,
}).strict();

export type ResponseNode = InferNode<typeof ResponseNodeDTO>;
