import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { DistinctPlatform } from '@/constants';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

export const ChoiceGoTo = define<Node.Interaction.ChoiceGoTo>({
  intentID: () => lorem.word(),
});

export const ChoiceStepData = define<Node.Interaction.Choice>({
  goTo: () => ChoiceGoTo(),
  intent: () => lorem.word(),
  action: () => getRandomEnumElement(Node.Interaction.ChoiceAction),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const InteractionStepData = define<Omit<Node.Interaction.StepData, 'else' | 'reprompt' | 'noReply'>>({
  name: () => lorem.word(),
  choices: () => [ChoiceStepData()],
});

export const ChoicePlatformNodeData = define<NodeData.InteractionChoice>({
  id: () => lorem.word(),
  goTo: () => ChoiceGoTo(),
  intent: () => lorem.word(),
  action: () => getRandomEnumElement(Node.Interaction.ChoiceAction),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const ChoiceDistinctPlatformsData = define<Record<DistinctPlatform, NodeData.InteractionChoice>>({
  ...distinctPlatformsData(() =>
    ChoicePlatformNodeData({ id: 'id', goTo: null, intent: '', action: Node.Interaction.ChoiceAction.PATH, mappings: [] })
  ),
});

export const InteractionNodeData = define<Omit<NodeData.Interaction, 'else' | 'noReply' | 'buttons'>>({
  name: () => lorem.word(),
  choices: () => [ChoiceDistinctPlatformsData()],
});
