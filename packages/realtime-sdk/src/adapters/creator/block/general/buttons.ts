import { Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData, NodeData.Buttons>(
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: voiceNoMatchAdapter.fromDB(noMatch),
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
  }),
  ({ else: noMatch, reprompt, ...data }) => ({
    ...data,
    else: voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatches),
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
  })
);

export default buttonsAdapter;
