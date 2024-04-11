import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { NodeType } from '../node-type.enum';
import { TriggerNodeItemType } from './trigger-node-item-type.enum';

export const TriggerNodeItemSettingsDTO = z
  .object({
    local: z.boolean(),
  })
  .strict();

export type TriggerNodeItemSettings = z.infer<typeof TriggerNodeItemSettingsDTO>;

export const TriggerNodeItemDTO = z
  .object({
    type: z.nativeEnum(TriggerNodeItemType),
    settings: TriggerNodeItemSettingsDTO,
    resourceID: z.string().nullable(),
  })
  .strict();

export type TriggerNodeItem = z.infer<typeof TriggerNodeItemDTO>;

export const TriggerNodeDataDTO = BaseNodeDataDTO.extend({
  items: z.array(TriggerNodeItemDTO),
}).strict();

export type TriggerNodeData = z.infer<typeof TriggerNodeDataDTO>;

export const TriggerNodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.TRIGGER),
  data: TriggerNodeDataDTO,
}).strict();

export type TriggerNode = InferNode<typeof TriggerNodeDTO>;
