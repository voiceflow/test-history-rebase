import { Node } from '@voiceflow/alexa-types';
import { ButtonType, IntentButton } from '@voiceflow/base-types/build/button';
import { Choice } from '@voiceflow/base-types/build/node/interaction';
import { PlatformType } from '@voiceflow/internal';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { DistinctPlatform } from '@/constants';
import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

import { noMatchesNodeDataFactory } from '../noMatch';
import { repromptFactory } from '../reprompt';
import { stepNoMatchPromptVoiceFactory, voiceTypePromptFactory } from '../voice';

export const choiceFactory = define<Choice>({
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const interactionChoiceFactory = define<NodeData.InteractionChoice>({
  id: () => datatype.uuid(),
  intent: () => '',
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const intentButtonFactory = define<IntentButton>({
  name: () => lorem.word(),
  payload: () => ({ intentID: datatype.uuid() }),
  type: () => getRandomEnumElement(ButtonType),
});

export const interactionRecordChoiceFactory = define<Record<DistinctPlatform, NodeData.InteractionChoice>>({
  [PlatformType.ALEXA]: () => interactionChoiceFactory(),
  [PlatformType.GOOGLE]: () => interactionChoiceFactory(),
  [PlatformType.GENERAL]: () => interactionChoiceFactory(),
});

export const interactionStepDataFactory = define<Node.Interaction.StepData>({
  choices: () => [choiceFactory()],
  else: () => stepNoMatchPromptVoiceFactory(),
  name: () => lorem.word(),
  reprompt: () => voiceTypePromptFactory(),
});

export const interactionNodeDataFactory = define<NodeData.Interaction>({
  buttons: () => [intentButtonFactory()],
  choices: () => [interactionRecordChoiceFactory()],
  else: () => noMatchesNodeDataFactory(),
  name: () => lorem.word(),
  reprompt: () => repromptFactory(),
});
