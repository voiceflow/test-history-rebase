import { z } from 'zod';

import type { InferCompiledNode } from '../base/base-node.compiled.dto';
import { BaseCompiledNodeDTO } from '../base/base-node.compiled.dto';
import { NodeType } from '../node-type.enum';

export const CompiledStartNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.START),
  data: z.never().optional(),
  nextId: z.string().optional(),
}).strict();

export type CompiledStartNode = InferCompiledNode<typeof CompiledStartNodeDTO>;
