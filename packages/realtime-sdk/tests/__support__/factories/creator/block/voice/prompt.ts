import { Node } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { VoiceNodeDataNoMatch, VoiceNodeDataPrompt, VoicePrompt, VoiceStepNoMatch } from '../shared';

export const PromptStepData = extend<ReturnType<typeof Base.PromptStepData>, Node.Prompt.StepData<any>>(Base.PromptStepData, {
  reprompt: () => VoicePrompt(),
  noMatches: () => VoiceStepNoMatch(),
});

export const PromptNodeData = extend<ReturnType<typeof Base.PromptNodeData>, Omit<NodeData.Prompt, 'buttons'>>(Base.PromptNodeData, {
  reprompt: () => VoiceNodeDataPrompt(),
  noMatchReprompt: () => VoiceNodeDataNoMatch(),
});
