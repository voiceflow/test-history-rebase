import { VoiceNode } from '@voiceflow/voice-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { baseInteractionAdapter } from '../base';
import { createBlockAdapter, fallbackNoMatch, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  VoiceNode.Interaction.StepData<any>,
  Omit<NodeData.Interaction, 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }, { platform }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseInteractionAdapter.fromDB(baseData, { platform }),

      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }, { platform }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform }),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default interactionAdapter;
