import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

import { intentButtonFactory } from '../intent';
import { voiceTypePromptFactory } from '../voice';

export const captureStepDataFactory = define<Node.Capture.StepData>({
  reprompt: () => voiceTypePromptFactory(),
  slot: () => '',
  slotInputs: () => [datatype.uuid()],
  variable: () => lorem.word(),
});

export const captureNodeDataFactory = define<NodeData.Capture>({
  buttons: () => [intentButtonFactory()],
  examples: () => [datatype.uuid()],
  reprompt: () => voiceTypePromptFactory() as any,
  slot: () => datatype.uuid(),
  variable: () => lorem.word(),
});
