import { z } from 'zod';

import type { InferCompiledNode } from '../base/base-node.compiled.dto';
import { BaseCompiledNodeDTO } from '../base/base-node.compiled.dto';
import { NodeType } from '../node-type.enum';

export const CompiledResponseDataDTO = z
  .object({
    responseID: z.string(),
  })
  .strict();

export type CompiledResponseData = z.infer<typeof CompiledResponseDataDTO>;

export const CompiledResponseNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.RESPONSE),
  data: CompiledResponseDataDTO,
  ports: z.object({
    default: z.string(),
  }),
}).strict();

export type CompiledResponseNode = InferCompiledNode<typeof CompiledResponseNodeDTO>;
