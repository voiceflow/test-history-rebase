import { z } from 'zod';

import { BaseNodeDataDTO, BaseNodeDTO, InferNode } from '../base/base-node.dto';
import { BaseNodeDataButtonDTO } from '../base/base-node-data-button.dto';
import { BaseNodeDataNoMatchDTO } from '../base/base-node-data-no-match.dto';
import { BaseNodeDataNoReplyDTO } from '../base/base-node-data-no-reply.dto';
import { NodeType } from '../node-type.enum';

export const ButtonsV2NodeDataItemDTO = BaseNodeDataButtonDTO.extend({
  id: z.string(),
}).strict();

export type ButtonsV2NodeDataItem = z.infer<typeof ButtonsV2NodeDataItemDTO>;

export const ButtonsV2NodeDataDTO = BaseNodeDataDTO.extend({
  items: z.array(ButtonsV2NodeDataItemDTO),
  noReply: z.nullable(BaseNodeDataNoReplyDTO).optional(),
  noMatch: z.nullable(BaseNodeDataNoMatchDTO).optional(),
  listenForOtherTriggers: z.boolean().nullable().optional(),
}).strict();

export type ButtonsV2NodeData = z.infer<typeof ButtonsV2NodeDataDTO>;

export const ButtonsV2NodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.BUTTONS_V2),
  data: ButtonsV2NodeDataDTO,
}).strict();

export type ButtonsV2Node = InferNode<typeof ButtonsV2NodeDTO>;
