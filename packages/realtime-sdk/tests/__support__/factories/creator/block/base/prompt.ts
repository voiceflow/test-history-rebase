import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

export const PromptStepData = define<Omit<Node.Prompt.StepData, 'reprompt' | 'noMatches'>>({});

export const PromptNodeData = define<Omit<NodeData.Prompt, 'buttons' | 'reprompt' | 'noMatchReprompt'>>({
  ports: () => [],
});
