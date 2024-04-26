import type { VoiceNode } from '@voiceflow/voice-types';

import type { NodeData } from '../../../../models';
import { baseButtonsAdapter } from '../base';
import {
  createBlockAdapter,
  fallbackNoMatch,
  voiceMigrateRepromptToNoReply,
  voiceNoMatchAdapter,
  voiceNoReplyAdapter,
} from '../utils';

const buttonsAdapter = createBlockAdapter<VoiceNode.Buttons.StepData<any>, NodeData.Buttons>(
  ({ else: elseData, reprompt, noReply, noMatch, ...baseData }, options) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);
    const noMatchWithFallback = fallbackNoMatch(noMatch, elseData);

    return {
      ...baseButtonsAdapter.fromDB(baseData, options),

      noMatch: noMatchWithFallback && voiceNoMatchAdapter.fromDB(noMatchWithFallback),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ noMatch, noReply, ...baseData }, options) => ({
    ...baseButtonsAdapter.toDB(baseData, options),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default buttonsAdapter;
