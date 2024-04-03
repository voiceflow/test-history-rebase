import { z } from 'zod';

import { VariableDatatype } from '@/variable/variable-datatype.enum';

import type { InferCompiledNode } from '../base/base-compiled-node.dto';
import { BaseCompiledNodeDTO } from '../base/base-compiled-node.dto';
import { NodeType } from '../node-type.enum';

export const FunctionCompiledVariableDeclarationDTO = z
  .object({
    type: z
      .nativeEnum(VariableDatatype)
      .refine((val) => val === VariableDatatype.TEXT || val === VariableDatatype.STRING, {
        message: `Function variables currently only support the 'string' type`,
      })
      .describe('The type of the Function variable. Used to render suitable UI and perform data validation.'),
  })
  .strict();

export type FunctionCompiledVariableDeclaration = z.infer<typeof FunctionCompiledVariableDeclarationDTO>;

export const FunctionCompiledDefinitionDTO = z
  .object({
    codeId: z.string().describe("Amazon S3 bucket key of the .js file containing this Function's code"),
    inputVars: z
      .record(FunctionCompiledVariableDeclarationDTO)
      .describe('Mapping of input variable name to its variable declaration.'),
    outputVars: z
      .record(FunctionCompiledVariableDeclarationDTO)
      .describe('Mapping of output variable name to its variable declaration.'),
    pathCodes: z.array(z.string()).describe('List of valid return codes for a function'),
  })
  .strict();

export type FunctionCompiledDefinition = z.infer<typeof FunctionCompiledDefinitionDTO>;

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
    definition: FunctionCompiledDefinitionDTO,
    invocation: FunctionCompiledInvocationDTO,
  })
  .strict();

export type FunctionCompiledData = z.infer<typeof FunctionCompiledDataDTO>;

export const FunctionCompiledNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: FunctionCompiledDataDTO,
}).strict();

export type FunctionCompiledNode = InferCompiledNode<typeof FunctionCompiledNodeDTO>;
