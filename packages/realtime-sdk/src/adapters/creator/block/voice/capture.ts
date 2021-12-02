import { Node } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseCaptureAdapter } from '../base';
import { createBlockAdapter, voiceMigrateRepromptToNoReply, voiceNoReplyAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData<any>, Omit<NodeData.Capture, 'buttons'>>(
  ({ reprompt, noReply, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseCaptureAdapter.fromDB(baseData),

      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noReply, ...baseData }) => ({
    ...baseCaptureAdapter.toDB(baseData),

    chips: null,
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default captureAdapter;
