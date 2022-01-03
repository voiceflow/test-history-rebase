import { NodeData, VoiceIntentSlot } from '@realtime-sdk/models';
import { Node as BaseNode } from '@voiceflow/base-types';
import { Node } from '@voiceflow/voice-types';

import { voiceIntentSlotSanitizer } from '../../../intent/voice';
import { createBlockAdapter, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.CaptureV2.StepData<any>, NodeData.CaptureV2>(
  ({ noReply, noMatch, capture }) => ({
    captureType: capture.type,
    variable: capture.type === BaseNode.CaptureV2.CaptureType.QUERY ? capture.variable : null,
    intent: capture.type === BaseNode.CaptureV2.CaptureType.INTENT ? { slots: capture.intent.slots?.map(voiceIntentSlotSanitizer) || [] } : undefined,
    noReply: noReply ? voiceNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? voiceNoMatchAdapter.fromDB(noMatch) : null,
  }),
  ({ noReply, noMatch, captureType, variable, ...baseData }) => ({
    capture:
      captureType === BaseNode.CaptureV2.CaptureType.INTENT
        ? {
            type: captureType,
            intent: { key: '', name: '', inputs: [], slots: (baseData.intent?.slots as VoiceIntentSlot[]).map(voiceIntentSlotSanitizer) },
          }
        : {
            type: captureType,
            variable,
          },
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
  })
);

export default captureAdapter;
