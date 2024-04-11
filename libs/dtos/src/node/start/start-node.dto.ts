import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';
import { TriggerNodeItemDTO } from '../trigger/trigger-node.dto';

export const StartNodeDataDTO = BaseNodeDataDTO.extend({
  label: z.string().optional(),
  triggers: z.array(TriggerNodeItemDTO).optional(),
}).strict();

export type StartNodeData = z.infer<typeof StartNodeDataDTO>;

export const StartNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.START),
  data: StartNodeDataDTO,
}).strict();

export type StartNode = InferNode<typeof StartNodeDTO>;
