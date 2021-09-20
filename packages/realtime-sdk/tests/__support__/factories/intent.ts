import { Node } from '@voiceflow/base-types';
import { ButtonType, IntentButton } from '@voiceflow/base-types/build/button';
import { PlatformType } from '@voiceflow/internal';
import { define } from 'cooky-cutter';
import { datatype, lorem, random } from 'faker';

import { DistinctPlatform } from '@/constants';
import { NodeData } from '@/models';

export const interactionChoiceFactory = define<NodeData.InteractionChoice>({
  id: () => datatype.uuid(),
  intent: () => '',
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const interactionRecordChoiceFactory = define<Record<DistinctPlatform, NodeData.InteractionChoice>>({
  [PlatformType.ALEXA]: () => interactionChoiceFactory(),
  [PlatformType.GOOGLE]: () => interactionChoiceFactory(),
  [PlatformType.GENERAL]: () => interactionChoiceFactory(),
});

export const intentButtonFactory = define<IntentButton>({
  name: () => lorem.word(),
  payload: () => ({ intentID: datatype.uuid() }),
  type: () => random.arrayElement(Object.values(ButtonType)),
});

export const intentStepDataFactory = define<Node.Intent.StepData>({
  intent: () => lorem.word(),
  mappings: () => [],
});

export const intentNodeDataFactory = define<NodeData.Intent>({
  [PlatformType.ALEXA]: () => ({ intent: lorem.word(), mappings: [] }),
  [PlatformType.GENERAL]: () => ({ intent: lorem.word(), mappings: [] }),
  [PlatformType.GOOGLE]: () => ({ intent: lorem.word(), mappings: [] }),
});
