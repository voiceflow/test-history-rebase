import type { VoiceNode } from '@voiceflow/voice-types';

import type { NodeData } from '../../../../models';
import { baseInteractionAdapter } from '../base';
import {
  createBlockAdapter,
  fallbackNoMatch,
  voiceMigrateRepromptToNoReply,
  voiceNoMatchAdapter,
  voiceNoReplyAdapter,
} from '../utils';

const interactionAdapter = createBlockAdapter<
  VoiceNode.Interaction.StepData<any>,
  Omit<NodeData.Interaction, 'buttons'>
>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }, options) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseInteractionAdapter.fromDB(baseData, options),

      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }, options) => ({
    ...baseInteractionAdapter.toDB(baseData, options),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default interactionAdapter;
