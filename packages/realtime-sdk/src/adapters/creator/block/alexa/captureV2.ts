import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureV2Adapter } from '../voice';

const captureV2Adapter = createBlockAdapter<AlexaNode.CaptureV2.StepData, NodeData.CaptureV2>(
  (voiceData, options) => voiceCaptureV2Adapter.fromDB(voiceData, options),
  (voiceData, options) => voiceCaptureV2Adapter.toDB(voiceData, options)
);

export default captureV2Adapter;
