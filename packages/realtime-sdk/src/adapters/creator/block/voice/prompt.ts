import { VoiceNode } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { basePromptAdapter } from '../base';
import { createBlockAdapter, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const promptAdapter = createBlockAdapter<VoiceNode.Prompt.StepData<any>, Omit<NodeData.Prompt, 'buttons'>>(
  ({ reprompt, noReply, noMatches, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...basePromptAdapter.fromDB(baseData),

      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
      noMatchReprompt: voiceNoMatchAdapter.fromDB(noMatches),
    };
  },
  ({ noReply, noMatchReprompt, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
    noMatches: voiceNoMatchAdapter.toDB(noMatchReprompt as NodeData.VoiceNoMatch),
  })
);

export default promptAdapter;
