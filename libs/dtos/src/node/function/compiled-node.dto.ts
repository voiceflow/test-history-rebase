import { z } from 'zod';

import type { InferCompiledNode } from '../base/compiled-node.dto';
import { BaseCompiledNodeDTO } from '../base/compiled-node.dto';
import { NodeType } from '../node-type.enum';
import { FunctionVariableType } from './function-variable-type.enum';

export const FunctionCompiledVariableConfigDTO = z.object({
  type: z
    .literal(FunctionVariableType.STRING)
    .describe('The type of the Function variable. Used to render suitable UI and perform data validation.'),
});

export type FunctionCompiledVariableConfig = z.infer<typeof FunctionCompiledVariableConfigDTO>;

export const FunctionCompiledDataDTO = z.object({
  code: z.string().describe('The code of the Function step'),
  inputVars: z
    .record(FunctionCompiledVariableConfigDTO)
    .describe('Mapping of input variable name to its configuration.'),
  outputVars: z
    .record(FunctionCompiledVariableConfigDTO)
    .describe('Mapping of output variable name to its configuration.'),
});

export type FunctionCompiledData = z.infer<typeof FunctionCompiledDataDTO>;

export const FunctionCompiledNodeDTO = BaseCompiledNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: z.object({
    functionDefn: FunctionCompiledDataDTO,
    inputMapping: z.record(z.string()),
    outputMapping: z.record(z.string().nullable()),
    paths: z.record(z.string()),
  }),
});

export type FunctionCompiledNode = InferCompiledNode<typeof FunctionCompiledNodeDTO>;
