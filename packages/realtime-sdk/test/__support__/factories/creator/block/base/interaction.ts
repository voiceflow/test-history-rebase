import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

export const ChoiceGoTo = define<BaseNode.Interaction.ChoiceGoTo>({
  intentID: () => lorem.word(),
  diagramID: () => lorem.word(),
});

export const ChoiceStepData = define<BaseNode.Interaction.Choice>({
  goTo: () => ChoiceGoTo(),
  intent: () => lorem.word(),
  action: () => getRandomEnumElement(BaseNode.Interaction.ChoiceAction),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const InteractionStepData = define<Omit<BaseNode.Interaction.StepData, 'else' | 'reprompt' | 'noReply'>>({
  name: () => lorem.word(),
  choices: () => [ChoiceStepData()],
});

export const ChoicePlatformNodeData = define<NodeData.InteractionChoice>({
  id: () => lorem.word(),
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const ChoiceData = define<NodeData.InteractionChoice>({
  ...ChoicePlatformNodeData({ id: 'id', intent: '', mappings: [] }),
});

export const InteractionNodeData = define<Omit<NodeData.Interaction, 'else' | 'noReply' | 'buttons'>>({
  name: () => lorem.word(),
  choices: () => [ChoiceData()],
  noMatch: null,
});
