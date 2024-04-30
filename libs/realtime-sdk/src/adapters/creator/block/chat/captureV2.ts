import { BaseNode } from '@voiceflow/base-types';
import type { ChatNode } from '@voiceflow/chat-types';
import type { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';

import type { NodeData } from '@/models';

import { baseCaptureV2Adapter } from '../base';
import { chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<ChatNode.CaptureV2.StepData, Omit<NodeData.CaptureV2, 'buttons'>>(
  ({ noReply, noMatch, capture, ...baseData }, options) => ({
    ...baseCaptureV2Adapter.fromDB(baseData, options),

    intent:
      capture.type === BaseNode.CaptureV2.CaptureType.INTENT
        ? { slots: capture.intent.slots?.map(Platform.Common.Chat.Utils.Intent.slotSanitizer) || [] }
        : undefined,
    noReply: noReply ? chatNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? chatNoMatchAdapter.fromDB(noMatch) : null,
    variable: capture.type === BaseNode.CaptureV2.CaptureType.QUERY ? capture.variable : null,
    captureType: capture.type,
  }),
  ({ intent, noReply, noMatch, captureType, variable, ...baseData }, options) => ({
    ...baseCaptureV2Adapter.toDB(baseData, options),

    capture:
      captureType === BaseNode.CaptureV2.CaptureType.INTENT
        ? {
            type: captureType,
            intent: {
              key: '',
              name: '',
              inputs: [],
              slots: (intent?.slots as Nullish<Platform.Common.Chat.Models.Intent.Slot[]>)?.map(
                Platform.Common.Chat.Utils.Intent.slotSanitizer
              ),
            },
          }
        : { type: captureType, variable },
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
  })
);

export default captureAdapter;
