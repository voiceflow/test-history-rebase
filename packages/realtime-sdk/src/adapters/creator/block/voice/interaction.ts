import { VoiceNode } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseInteractionAdapter } from '../base';
import { createBlockAdapter, fallbackNoMatch, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<VoiceNode.Interaction.StepData<any>, Omit<NodeData.Interaction, 'buttons'>>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseInteractionAdapter.fromDB(baseData),

      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }) => ({
    ...baseInteractionAdapter.toDB(baseData),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default interactionAdapter;
