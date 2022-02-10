import { NodeData } from '@realtime-sdk/models';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const captureAdapter = createBlockAdapter<VoiceflowNode.Capture.VoiceStepData, NodeData.Capture>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceCaptureAdapter.fromDB(voiceData),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceCaptureAdapter.toDB(voiceData),

    chips: null,
    buttons,
  })
);

export default captureAdapter;
