import type { AlexaNode } from '@voiceflow/alexa-types';
import { extend } from 'cooky-cutter';

import type { NodeData } from '@/models';

import * as Voice from '../voice';

export const PromptStepData = extend<ReturnType<typeof Voice.PromptStepData>, AlexaNode.Prompt.StepData>(
  Voice.PromptStepData,
  {}
);

export const PromptNodeData = extend<ReturnType<typeof Voice.PromptNodeData>, NodeData.Prompt>(Voice.PromptNodeData, {
  buttons: () => null,
});
