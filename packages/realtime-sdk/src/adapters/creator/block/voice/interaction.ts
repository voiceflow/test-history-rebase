import { Node } from '@voiceflow/voice-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { baseInteractionAdapter } from '../base';
import { createBlockAdapter, voiceNoMatchAdapter, voicePromptAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  Node.Interaction.StepData<any>,
  Omit<NodeData.Interaction, 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ else: elseData, reprompt, ...baseData }, { platform }) => ({
    ...baseInteractionAdapter.fromDB(baseData, { platform }),

    else: voiceNoMatchAdapter.fromDB(elseData),
    reprompt: reprompt && voicePromptAdapter.fromDB(reprompt),
  }),
  ({ else: elseData, reprompt, ...baseData }, { platform }) => ({
    ...baseInteractionAdapter.toDB(baseData, { platform }),

    else: voiceNoMatchAdapter.toDB(elseData as NodeData.VoiceNoMatch),
    reprompt: reprompt && voicePromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
  })
);

export default interactionAdapter;
