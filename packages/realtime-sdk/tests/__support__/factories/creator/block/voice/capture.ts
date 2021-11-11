import { Node } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { VoiceNodeDataPrompt, VoicePrompt } from '../shared';

export const CaptureStepData = extend<ReturnType<typeof Base.CaptureStepData>, Node.Capture.StepData<any>>(Base.CaptureStepData, {
  reprompt: () => VoicePrompt(),
});

export const CaptureNodeData = extend<ReturnType<typeof Base.CaptureNodeData>, Omit<NodeData.Capture, 'buttons'>>(Base.CaptureNodeData, {
  reprompt: () => VoiceNodeDataPrompt(),
});
