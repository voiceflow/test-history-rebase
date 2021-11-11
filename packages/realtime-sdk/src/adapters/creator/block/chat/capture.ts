import { Node, Types } from '@voiceflow/chat-types';

import { NodeData } from '../../../../models';
import { baseCaptureAdapter } from '../base';
import { chatPromptAdapter, chipsToIntentButtons, createBlockAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ chips, reprompt, buttons, ...baseData }) => ({
    ...baseCaptureAdapter.fromDB(baseData),

    buttons: buttons ?? chipsToIntentButtons(chips),
    reprompt: reprompt && chatPromptAdapter.fromDB(reprompt),
  }),
  ({ reprompt, buttons, ...baseData }) => ({
    ...baseCaptureAdapter.toDB(baseData),

    chips: null,
    buttons,
    reprompt: reprompt && chatPromptAdapter.toDB(reprompt as Types.Prompt),
  })
);

export default captureAdapter;
