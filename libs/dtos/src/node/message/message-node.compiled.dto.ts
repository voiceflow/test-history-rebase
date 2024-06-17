import { z } from 'zod';

import { BaseCompiledNodeDTO, InferCompiledNode } from '../base/base-node.compiled.dto';
import { NodeType } from '../node-type.enum';

export const CompiledMessageDataDTO = z
  .object({
    messageID: z.string()
  })
  .strict();

export type CompiledMessageData = z.infer<typeof CompiledMessageDataDTO>;

export const CompiledMessageNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.MESSAGE),
  data: CompiledMessageDataDTO,
  ports: z.object({
    default: z.string().nullable()
  })
}).strict();

export type CompiledMessageNode = InferCompiledNode<typeof CompiledMessageNodeDTO>;
