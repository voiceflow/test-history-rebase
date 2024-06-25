import { z } from 'zod';

import { AIParamsDTO } from '@/ai/ai-params.dto';
import { AIPromptWrapperDTO } from '@/ai/ai-prompt-wrapper.dto';

import type { InferNode } from '../base/base-node.dto';
import { BaseNodeDataDTO, BaseNodeDTO } from '../base/base-node.dto';
import { BaseNodeDataAutomaticRepromptDTO } from '../base/base-node-data-automatic-reprompt.dto';
import { BaseNodeDataNoReplyDTO } from '../base/base-node-data-no-reply.dto';
import { BaseNodeDataPathDTO } from '../base/base-node-data-path.dto';
import { NodeType } from '../node-type.enum';
import { CaptureV3NodeCaptureType } from './capture-v3-node-capture-type.enum';

export const CaptureV3NodeDataEntityCaptureItemDTO = BaseNodeDataPathDTO.extend({
  id: z.string(),
  entityID: z.string(),
  variableID: z.string().nullable().optional(),
  repromptID: z.string().nullable().optional(),
  placeholder: z.string().nullable().optional(),
}).strict();

export type CaptureV3NodeDataEntityCaptureItem = z.infer<typeof CaptureV3NodeDataEntityCaptureItemDTO>;

export const CaptureV3NodeDataEntityCaptureAutomaticRepromptDTO = BaseNodeDataAutomaticRepromptDTO.extend({
  params: z
    .nullable(AIParamsDTO.pick({ model: true, system: true, maxTokens: true, temperature: true }).required().strict())
    .optional(),
  promptWrapper: z.nullable(AIPromptWrapperDTO).optional(),
}).strict();

export type CaptureV3NodeDataEntityCaptureAutomaticReprompt = z.infer<
  typeof CaptureV3NodeDataEntityCaptureAutomaticRepromptDTO
>;

export const CaptureV3NodeDataEntityCaptureDTO = z
  .object({
    type: z.literal(CaptureV3NodeCaptureType.ENTITY),
    items: z.array(CaptureV3NodeDataEntityCaptureItemDTO),
    automaticReprompt: z.nullable(CaptureV3NodeDataEntityCaptureAutomaticRepromptDTO),
  })
  .strict();

export type CaptureV3NodeDataEntityCapture = z.infer<typeof CaptureV3NodeDataEntityCaptureDTO>;

export const CaptureV3NodeDataUserReplyCaptureDTO = z
  .object({
    type: z.literal(CaptureV3NodeCaptureType.USER_REPLY),
    variableID: z.string().nullable().optional(),
  })
  .strict();

export type CaptureV3NodeDataUserReplyCapture = z.infer<typeof CaptureV3NodeDataUserReplyCaptureDTO>;

export const CaptureV3NodeDataDTO = BaseNodeDataDTO.extend({
  capture: z.discriminatedUnion('type', [CaptureV3NodeDataEntityCaptureDTO, CaptureV3NodeDataUserReplyCaptureDTO]),
  noReply: z.nullable(BaseNodeDataNoReplyDTO).optional(),
  listenForOtherTriggers: z.boolean().nullable().optional(),
}).strict();

export type CaptureV3NodeData = z.infer<typeof CaptureV3NodeDataDTO>;

export const CaptureV3NodeDTO = BaseNodeDTO.extend({
  type: z.literal(NodeType.CAPTURE_V3),
  data: CaptureV3NodeDataDTO,
}).strict();

export type CaptureV3Node = InferNode<typeof CaptureV3NodeDTO>;
