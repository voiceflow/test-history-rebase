import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

const promptAdapter = createBlockAdapter<AlexaNode.Prompt.StepData, NodeData.Prompt>(
  (voiceData, options) => ({
    ...voicePromptAdapter.fromDB(voiceData, options),

    buttons: null, // no buttons on alexa
  }),
  (voiceData, options) => ({
    ...voicePromptAdapter.toDB(voiceData, options),

    chips: null,
    buttons: null,
  })
);

export default promptAdapter;
