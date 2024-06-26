import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const PromptStepData = define<Omit<BaseNode.Prompt.StepData, 'reprompt' | 'noReply' | 'noMatches'>>({});

export const PromptNodeData = define<Omit<NodeData.Prompt, 'buttons' | 'noReply' | 'noMatchReprompt'>>({
  ports: () => [],
});
