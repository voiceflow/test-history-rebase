import { VoiceNode } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseButtonsAdapter } from '../base';
import { createBlockAdapter, fallbackNoMatch, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<VoiceNode.Buttons.StepData<any>, NodeData.Buttons>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseButtonsAdapter.fromDB(baseData),

      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }) => ({
    ...baseButtonsAdapter.toDB(baseData),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default buttonsAdapter;
