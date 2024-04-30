import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import type { NodeData } from '@/models';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const captureAdapter = createBlockAdapter<VoiceflowNode.Capture.VoiceStepData, NodeData.Capture>(
  ({ chips, buttons, ...voiceData }, options) => ({
    ...voiceCaptureAdapter.fromDB(voiceData, options),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }, options) => ({
    ...voiceCaptureAdapter.toDB(voiceData, options),

    chips: null,
    buttons,
  })
);

export default captureAdapter;
