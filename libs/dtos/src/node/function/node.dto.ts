import { z } from 'zod';

import { MarkupDTO } from '@/common';

import type { InferNode } from '../base/node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/node.dto';
import { NodeType } from '../node-type.enum';

export const FunctionNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.FUNCTION),
  data: BaseNodeDataDTO.extend({
    functionID: z.string().nullable(),
    inputMapping: z.record(MarkupDTO),
    outputMapping: z.record(z.string().nullable()),
  }),
});

export type FunctionNode = InferNode<typeof FunctionNodeDTO>;
