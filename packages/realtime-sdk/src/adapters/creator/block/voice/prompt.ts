import { VoiceNode } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { basePromptAdapter } from '../base';
import { createBlockAdapter, fallbackNoMatch, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const promptAdapter = createBlockAdapter<VoiceNode.Prompt.StepData<any>, Omit<NodeData.Prompt, 'buttons'>>(
  ({ reprompt, noReply, noMatch, noMatches, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, noMatches);

    return {
      ...basePromptAdapter.fromDB(baseData),

      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
    };
  },
  ({ noReply, noMatch, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
  })
);

export default promptAdapter;
