import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  (voiceData) => ({
    ...voicePromptAdapter.fromDB(voiceData),

    buttons: null, // no buttons on alexa
  }),
  (voiceData) => ({
    ...voicePromptAdapter.toDB(voiceData),

    chips: null,
    buttons: null,
  })
);

export default promptAdapter;
