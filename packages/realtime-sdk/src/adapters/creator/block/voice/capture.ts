import { Node } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseCaptureAdapter } from '../base';
import { createBlockAdapter, voicePromptAdapter } from '../utils';

const captureAdapter = createBlockAdapter<Node.Capture.StepData<any>, Omit<NodeData.Capture, 'buttons'>>(
  ({ reprompt, ...baseData }) => ({
    ...baseCaptureAdapter.fromDB(baseData),

    reprompt: reprompt && voicePromptAdapter.fromDB(reprompt),
  }),
  ({ reprompt, ...baseData }) => ({
    ...baseCaptureAdapter.toDB(baseData),

    chips: null,
    reprompt: reprompt && voicePromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
  })
);

export default captureAdapter;
