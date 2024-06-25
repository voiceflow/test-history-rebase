import type { VoiceNode } from '@voiceflow/voice-types';

import type { NodeData } from '../../../../models';
import { baseCaptureAdapter } from '../base';
import { createBlockAdapter, voiceMigrateRepromptToNoReply, voiceNoReplyAdapter } from '../utils';

const captureAdapter = createBlockAdapter<VoiceNode.Capture.StepData<any>, Omit<NodeData.Capture, 'buttons'>>(
  ({ reprompt, noReply, ...baseData }, options) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseCaptureAdapter.fromDB(baseData, options),

      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noReply, ...baseData }, options) => ({
    ...baseCaptureAdapter.toDB(baseData, options),

    chips: null,
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default captureAdapter;
