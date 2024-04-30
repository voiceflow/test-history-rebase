import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import type { VoiceNode } from '@voiceflow/voice-types';

import type { NodeData } from '@/models';

import { baseCaptureV2Adapter } from '../base';
import { createBlockAdapter, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const captureAdapter = createBlockAdapter<VoiceNode.CaptureV2.StepData<any>, NodeData.CaptureV2>(
  ({ noReply, noMatch, capture, ...baseData }, options) => ({
    ...baseCaptureV2Adapter.fromDB(baseData, options),

    intent:
      capture.type === BaseNode.CaptureV2.CaptureType.INTENT
        ? { slots: capture.intent.slots?.map(Platform.Common.Voice.CONFIG.utils.intent.slotSanitizer) || [] }
        : undefined,

    noReply: noReply ? voiceNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? voiceNoMatchAdapter.fromDB(noMatch) : null,
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
              slots: (intent?.slots as Platform.Common.Voice.Models.Intent.Slot[])?.map(
                Platform.Common.Voice.CONFIG.utils.intent.slotSanitizer
              ),
              inputs: [],
            },
          }
        : { type: captureType, variable },

    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
  })
);

export default captureAdapter;
