import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const CaptureStepData = define<Omit<BaseNode.Capture.StepData, 'noReply'>>({
  slot: () => '',
  variable: () => faker.lorem.word(),
  slotInputs: () => [faker.datatype.uuid()],
});

export const CaptureNodeData = define<Omit<NodeData.Capture, 'buttons' | 'noReply'>>({
  slot: () => faker.datatype.uuid(),
  examples: () => [faker.datatype.uuid()],
  variable: () => faker.lorem.word(),
});
