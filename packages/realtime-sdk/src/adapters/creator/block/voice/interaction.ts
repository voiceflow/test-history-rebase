import { VoiceNode } from '@voiceflow/voice-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { baseInteractionAdapter } from '../base';
import { createBlockAdapter, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  VoiceNode.Interaction.StepData<any>,
  Omit<NodeData.Interaction, 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ else: elseData, reprompt, noReply, ...baseData }, { platform }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseInteractionAdapter.fromDB(baseData, { platform }),

      else: voiceNoMatchAdapter.fromDB(elseData),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ else: elseData, noReply, ...baseData }, { platform }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform }),

    else: voiceNoMatchAdapter.toDB(elseData as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default interactionAdapter;
