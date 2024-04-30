import type { AlexaNode } from '@voiceflow/alexa-types';

import type { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<AlexaNode.Capture.StepData, NodeData.Capture>(
  (voiceData, options) => ({
    ...voiceCaptureAdapter.fromDB(voiceData, options),

    buttons: null, // no buttons on alexa
  }),
  (voiceData, options) => ({
    ...voiceCaptureAdapter.toDB(voiceData, options),

    chips: null,
    buttons: null,
  })
);

export default captureAdapter;
