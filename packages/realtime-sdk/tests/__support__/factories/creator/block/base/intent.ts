import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { NodeData } from '@/models';

export const IntentStepData = define<BaseNode.Intent.StepData>({
  intent: () => lorem.word(),
  mappings: () => [],
  availability: BaseNode.Intent.IntentAvailability.GLOBAL,
});

export const IntentNodeData = define<NodeData.Intent.PlatformData>({
  intent: lorem.word(),
  mappings: [],
  availability: BaseNode.Intent.IntentAvailability.GLOBAL,
});
