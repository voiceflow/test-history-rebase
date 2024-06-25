import { z } from 'zod';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { BaseNodeDataAutomaticRepromptDTO } from '../base/base-node-data-automatic-reprompt.dto';
import { BaseNodeDataButtonDTO } from '../base/base-node-data-button.dto';
import { BaseNodeDataNoMatchDTO } from '../base/base-node-data-no-match.dto';
import { BaseNodeDataNoReplyDTO } from '../base/base-node-data-no-reply.dto';
import { BaseNodeDataPathDTO } from '../base/base-node-data-path.dto';
import { NodeType } from '../node-type.enum';

export const ChoiceV2NodeDataItemDTO = BaseNodeDataPathDTO.extend({
  id: z.string(),
  button: z.nullable(BaseNodeDataButtonDTO).optional(),
  intentID: z.string(),
}).strict();

export type ChoiceV2NodeDataItem = z.infer<typeof ChoiceV2NodeDataItemDTO>;

export const ChoiceV2NodeDataDTO = BaseNodeDataDTO.extend({
  items: z.array(ChoiceV2NodeDataItemDTO),
  noReply: z.nullable(BaseNodeDataNoReplyDTO).optional(),
  noMatch: z.nullable(BaseNodeDataNoMatchDTO).optional(),
  automaticReprompt: z.nullable(BaseNodeDataAutomaticRepromptDTO).optional(),
  listenForOtherTriggers: z.boolean().nullable().optional(),
}).strict();

export type ChoiceV2NodeData = z.infer<typeof ChoiceV2NodeDataDTO>;

export const ChoiceV2NodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.CHOICE_V2),
  data: ChoiceV2NodeDataDTO,
}).strict();

export type ChoiceV2Node = InferNode<typeof ChoiceV2NodeDTO>;
