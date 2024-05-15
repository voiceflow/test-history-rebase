import { z } from 'zod';

import { NodeType } from '../node-type.enum';

export const BaseCompiledNodeDTO = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  data: z.unknown().optional(),
});

export type BaseCompiledNode = z.infer<typeof BaseCompiledNodeDTO>;

export type InferCompiledNode<N extends z.ZodType<any> & { ['_output']: BaseCompiledNode }> = z.infer<N>;
