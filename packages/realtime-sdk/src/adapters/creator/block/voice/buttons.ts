import { Node } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseButtonsAdapter } from '../base';
import { createBlockAdapter, voiceMigrateRepromptToNoReply, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData<any>, NodeData.Buttons>(
  ({ else: noMatch, reprompt, noReply, ...baseData }) => {
    const migratedNoReply = voiceMigrateRepromptToNoReply(noReply, reprompt);

    return {
      ...baseButtonsAdapter.fromDB(baseData),

      else: voiceNoMatchAdapter.fromDB(noMatch),
      noReply: migratedNoReply && voiceNoReplyAdapter.fromDB(migratedNoReply),
    };
  },
  ({ else: noMatch, noReply, ...baseData }) => ({
    ...baseButtonsAdapter.toDB(baseData),

    else: voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default buttonsAdapter;
