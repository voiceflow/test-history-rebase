import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const SpeakStepData = define<BaseNode.Speak.StepData>({
  randomize: () => faker.datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(BaseNode.Utils.CanvasNodeVisibility),
});

export const SpeakNodeData = define<Omit<NodeData.Speak, 'dialogs'>>({
  randomize: () => faker.datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(BaseNode.Utils.CanvasNodeVisibility),
});
