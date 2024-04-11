import { z } from 'zod';

import type { InferCompiledNode } from '../base/base-compiled-node.dto';
import { BaseCompiledNodeDTO } from '../base/base-compiled-node.dto';
import { NodeType } from '../node-type.enum';

export const StartCompiledNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.START),
  data: z.never().optional(),
  nextId: z.string().optional(),
}).strict();

export type StartCompiledNodeNode = InferCompiledNode<typeof StartCompiledNodeDTO>;
