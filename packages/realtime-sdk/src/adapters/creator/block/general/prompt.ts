import { Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData, NodeData.Prompt>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voicePromptAdapter.fromDB(voiceData),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voicePromptAdapter.toDB(voiceData),

    chips: null,
    buttons,
  })
);

export default promptAdapter;
