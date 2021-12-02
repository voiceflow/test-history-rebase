import { Node } from '@voiceflow/chat-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { BUTTON_STEP_DATA_FACTORY_CONFIG, ChatNodeDataNoReply, ChatPrompt, ChatStepNoReply, IntentButton } from '../shared';

export const CaptureStepData = extend<ReturnType<typeof Base.CaptureStepData>, Node.Capture.StepData>(Base.CaptureStepData, {
  ...BUTTON_STEP_DATA_FACTORY_CONFIG,
  noReply: () => ChatStepNoReply(),
  reprompt: () => ChatPrompt(),
});

export const CaptureNodeData = extend<ReturnType<typeof Base.CaptureNodeData>, NodeData.Capture>(Base.CaptureNodeData, {
  buttons: () => [IntentButton()],
  noReply: () => ChatNodeDataNoReply(),
});
