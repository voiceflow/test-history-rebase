import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { extend } from 'cooky-cutter';

import * as Voice from '../voice';

export const CaptureStepData = extend<ReturnType<typeof Voice.CaptureStepData>, AlexaNode.Capture.StepData>(
  Voice.CaptureStepData,
  {}
);

export const CaptureNodeData = extend<ReturnType<typeof Voice.CaptureNodeData>, NodeData.Capture>(
  Voice.CaptureNodeData,
  {
    buttons: () => null,
  }
);
