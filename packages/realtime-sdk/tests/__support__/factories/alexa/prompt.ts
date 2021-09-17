import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

import { intentButtonFactory } from '../intent';
import { stepNoMatchPromptFactory } from '../noMatch';
import { repromptFactory } from '../reprompt';
import { noMatchesNodeDataFactory, voiceTypePromptFactory } from '../voice';

export const promptStepDataFactory = define<Node.Prompt.StepData>({
  noMatches: () => stepNoMatchPromptFactory(),
  reprompt: () => voiceTypePromptFactory(),
});

export const promptNodeDataFactory = define<NodeData.Prompt>({
  buttons: () => [intentButtonFactory()],
  reprompt: () => repromptFactory(),
  noMatchReprompt: () => noMatchesNodeDataFactory(),
});
