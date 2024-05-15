import { z } from 'zod';

import type { InferCompiledNode } from '../../base/base-node.compiled.dto';
import { BaseCompiledNodeDTO } from '../../base/base-node.compiled.dto';
import { NodeType } from '../../node-type.enum';
import { CompiledFunctionInvocationDTO } from './function-invocation.compiled.dto';
import { CompiledFunctionLegacyReferenceDTO, CompiledFunctionReferenceDTO } from './function-reference.compiled.dto';

export type { CompiledFunctionInvocation } from './function-invocation.compiled.dto';
export type { CompiledFunctionLegacyReference, CompiledFunctionReference } from './function-reference.compiled.dto';

export const CompiledFunctionDataDTO = z
  .object({
    definition: z.union([CompiledFunctionReferenceDTO, CompiledFunctionLegacyReferenceDTO]),
    invocation: CompiledFunctionInvocationDTO,
  })
  .strict();

export type CompiledFunctionData = z.infer<typeof CompiledFunctionDataDTO>;

export const CompiledFunctionNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: CompiledFunctionDataDTO,
}).strict();

export type CompiledFunctionNode = InferCompiledNode<typeof CompiledFunctionNodeDTO>;
