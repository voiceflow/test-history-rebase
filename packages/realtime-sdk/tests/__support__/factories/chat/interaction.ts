import { ButtonsLayout } from '@voiceflow/base-types/build/button';
import { Node } from '@voiceflow/chat-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

import { choiceFactory } from '../choice';
import { intentButtonFactory, interactionRecordChoiceFactory } from '../intent';
import { noMatchesNodeDataFactory } from '../noMatch';
import { repromptFactory } from '../reprompt';
import { chipFactory, promptChatTypeFactory } from './capture';

export const interactionStepDataFactory = define<Node.Interaction.StepData>({
  choices: () => [choiceFactory()],
  else: () => [],
  name: () => lorem.word(),
  reprompt: () => promptChatTypeFactory(),
  buttons: () => [intentButtonFactory()],
  buttonsLayout: () => getRandomEnumElement(ButtonsLayout),
  chips: () => [chipFactory()],
});

export const interactionNodeDataFactory = define<NodeData.Interaction>({
  buttons: () => [intentButtonFactory()],
  choices: () => [interactionRecordChoiceFactory()],
  else: () => noMatchesNodeDataFactory(),
  name: () => lorem.word(),
  reprompt: () => repromptFactory(),
});
