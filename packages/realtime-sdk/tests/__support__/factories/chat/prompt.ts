import { ButtonsLayout } from '@voiceflow/base-types/build/button';
import { Node } from '@voiceflow/chat-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

import getRandomEnumElement from '../../helpers/getRandomEnumElement';
import { intentButtonFactory } from '../intent';
import { repromptFactory } from '../reprompt';
import { noMatchesNodeDataFactory } from '../voice';
import { chipFactory, promptChatTypeFactory } from './capture';
import { chatNoMatchesFactory } from './noMatches';

export const promptStepDataFactory = define<Node.Prompt.StepData>({
  noMatches: () => chatNoMatchesFactory(),
  reprompt: () => promptChatTypeFactory(),
  buttons: () => [intentButtonFactory()],
  buttonsLayout: () => getRandomEnumElement(ButtonsLayout),
  chips: () => [chipFactory()],
});

export const promptNodeDataFactory = define<NodeData.Prompt>({
  buttons: () => [intentButtonFactory()],
  reprompt: () => repromptFactory(),
  noMatchReprompt: () => noMatchesNodeDataFactory(),
});
