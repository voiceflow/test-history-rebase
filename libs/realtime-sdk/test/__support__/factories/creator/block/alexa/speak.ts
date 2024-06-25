import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { extend } from 'cooky-cutter';

import * as Voice from '../voice';

export const SpeakStepData = extend<ReturnType<typeof Voice.SpeakStepData>, AlexaNode.Speak.StepData>(
  Voice.SpeakStepData,
  {}
);

export const SpeakNodeData = extend<ReturnType<typeof Voice.SpeakNodeData>, NodeData.Speak>(Voice.SpeakNodeData, {});
