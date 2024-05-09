import { z } from 'zod';

import type { InferCompiledNode } from '../base/base-compiled-node.dto';
import { BaseCompiledNodeDTO } from '../base/base-compiled-node.dto';
import { NodeType } from '../node-type.enum';

export const NextCompiledNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.NEXT),
  nextId: z.string().nullable().optional(),
}).strict();

export type NextCompiledNode = InferCompiledNode<typeof NextCompiledNodeDTO>;
