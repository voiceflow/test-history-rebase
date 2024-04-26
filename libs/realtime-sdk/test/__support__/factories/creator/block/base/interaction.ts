import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const ChoiceGoTo = define<BaseNode.Interaction.ChoiceGoTo>({
  intentID: () => faker.lorem.word(),
  diagramID: () => faker.lorem.word(),
});

export const ChoiceStepData = define<BaseNode.Interaction.Choice>({
  goTo: () => ChoiceGoTo(),
  intent: () => faker.lorem.word(),
  action: () => getRandomEnumElement(BaseNode.Interaction.ChoiceAction),
  mappings: () => [{ slot: faker.lorem.word(), variable: faker.lorem.word() }],
});

export const InteractionStepData = define<Omit<BaseNode.Interaction.StepData, 'else' | 'reprompt' | 'noReply'>>({
  name: () => faker.lorem.word(),
  choices: () => [ChoiceStepData()],
});

export const ChoicePlatformNodeData = define<NodeData.InteractionChoice>({
  id: () => faker.lorem.word(),
  intent: () => faker.lorem.word(),
  mappings: () => [{ slot: faker.lorem.word(), variable: faker.lorem.word() }],
});

export const ChoiceData = define<NodeData.InteractionChoice>({
  ...ChoicePlatformNodeData({ id: 'id', intent: '', mappings: [] }),
});

export const InteractionNodeData = define<Omit<NodeData.Interaction, 'else' | 'noReply' | 'buttons'>>({
  name: () => faker.lorem.word(),
  choices: () => [ChoiceData()],
  noMatch: null,
});
