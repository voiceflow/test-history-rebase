import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, image, internet, lorem } from 'faker';

import { NodeData } from '@/models';

export const streamStepDataFactory = define<Node.Stream.StepData>({
  audio: () => internet.url(),
  customPause: () => datatype.boolean(),
  loop: () => datatype.boolean(),
  backgroundImage: () => image.animals(),
  description: () => lorem.words(),
  iconImage: () => image.animals(),
  title: () => lorem.words(),
});

export const streamNodeDataFactory = define<NodeData.Stream>({
  audio: () => internet.url(),
  customPause: () => datatype.boolean(),
  loop: () => datatype.boolean(),
  backgroundImage: () => image.animals(),
  description: () => lorem.words(),
  iconImage: () => image.animals(),
  title: () => lorem.words(),
});
