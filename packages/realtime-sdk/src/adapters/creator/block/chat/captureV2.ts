import { ChatIntentSlot, NodeData } from '@realtime-sdk/models';
import { Node as BaseNode } from '@voiceflow/base-types';
import { Node } from '@voiceflow/chat-types';

import { chatIntentSlotSanitizer } from '../../../intent/chat';
import { chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.CaptureV2.StepData, Omit<NodeData.CaptureV2, 'buttons'>>(
  ({ noReply, noMatch, capture }) => ({
    captureType: capture.type,
    variable: capture.type === BaseNode.CaptureV2.CaptureType.QUERY ? capture.variable : null,
    intent: capture.type === BaseNode.CaptureV2.CaptureType.INTENT ? { slots: capture.intent.slots?.map(chatIntentSlotSanitizer) || [] } : undefined,
    noReply: noReply ? chatNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? chatNoMatchAdapter.fromDB(noMatch) : null,
  }),
  ({ noReply, noMatch, captureType, variable, ...baseData }) => ({
    capture:
      captureType === BaseNode.CaptureV2.CaptureType.INTENT
        ? {
            type: captureType,
            intent: { key: '', name: '', inputs: [], slots: (baseData.intent?.slots as ChatIntentSlot[]).map(chatIntentSlotSanitizer) },
          }
        : {
            type: captureType,
            variable,
          },
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as Node.Utils.StepNoReply),
    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
  })
);

export default captureAdapter;
