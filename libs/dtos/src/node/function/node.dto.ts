import { z } from 'zod';

import { MarkupDTO } from '@/common';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';

export const FunctionNodeDataDTO = BaseNodeDataDTO.extend({
  functionID: z.string().nullable(),
  inputMapping: z.record(MarkupDTO),
  outputMapping: z.record(z.string().nullable()),
}).strict();

export type FunctionNodeData = z.infer<typeof FunctionNodeDataDTO>;

export const FunctionNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: FunctionNodeDataDTO,
}).strict();

export type FunctionNode = InferNode<typeof FunctionNodeDTO>;

export const FUNCTION_DEFAULT_PORT = '__vf__default';
