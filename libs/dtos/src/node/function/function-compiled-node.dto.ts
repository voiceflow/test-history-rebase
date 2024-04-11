import { z } from 'zod';

import { FunctionCompiledDefinitionDTO } from '../../function/function-compiled-definition.dto';
import type { InferCompiledNode } from '../base/base-compiled-node.dto';
import { BaseCompiledNodeDTO } from '../base/base-compiled-node.dto';
import { NodeType } from '../node-type.enum';

export const FunctionLegacyCompiledReferenceDTO = FunctionCompiledDefinitionDTO.describe(
  '[Deprecated]: an embedding of the function definition into a compiled function node'
);

export type FunctionLegacyCompiledReference = z.infer<typeof FunctionLegacyCompiledReferenceDTO>;

export const FunctionCompiledReferenceDTO = z
  .object({
    functionId: z.string().describe('ID of function being referenced'),
  })
  .strict();

export type FunctionCompiledReference = z.infer<typeof FunctionCompiledReferenceDTO>;

export const FunctionCompiledInvocationDTO = z
  .object({
    paths: z.record(z.string()).describe('Mapping of path code to next step id'),
    inputVars: z.record(z.string()).describe('Mapping of input variable name to its argument value'),
    outputVars: z
      .record(z.string().nullable())
      .describe('Mapping of output variable name to its assignment target, a canvas variable'),
  })
  .strict();

export type FunctionCompiledInvocation = z.infer<typeof FunctionCompiledInvocationDTO>;

export const FunctionCompiledDataDTO = z
  .object({
    definition: z.union([FunctionCompiledReferenceDTO, FunctionLegacyCompiledReferenceDTO]),
    invocation: FunctionCompiledInvocationDTO,
  })
  .strict();

export type FunctionCompiledData = z.infer<typeof FunctionCompiledDataDTO>;

export const FunctionCompiledNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: FunctionCompiledDataDTO,
}).strict();

export type FunctionCompiledNode = InferCompiledNode<typeof FunctionCompiledNodeDTO>;
