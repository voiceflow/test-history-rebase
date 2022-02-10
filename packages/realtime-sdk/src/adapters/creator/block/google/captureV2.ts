import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureV2Adapter } from '../voice';

const captureV2Adapter = createBlockAdapter<AlexaNode.CaptureV2.StepData, NodeData.CaptureV2>(
  (voiceData) => voiceCaptureV2Adapter.fromDB(voiceData),
  (voiceData) => voiceCaptureV2Adapter.toDB(voiceData)
);

export default captureV2Adapter;
