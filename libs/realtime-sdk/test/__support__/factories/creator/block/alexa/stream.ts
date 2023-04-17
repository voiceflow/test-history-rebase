import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, image, internet, lorem } from 'faker';

export const StreamStepData = define<AlexaNode.Stream.StepData>({
  loop: () => datatype.boolean(),
  audio: () => internet.url(),
  title: () => lorem.words(),
  iconImage: () => image.animals(),
  description: () => lorem.words(),
  customPause: () => datatype.boolean(),
  backgroundImage: () => image.animals(),
});

export const StreamNodeData = define<NodeData.Stream>({
  loop: () => datatype.boolean(),
  audio: () => internet.url(),
  title: () => lorem.words(),
  iconImage: () => image.animals(),
  description: () => lorem.words(),
  customPause: () => datatype.boolean(),
  backgroundImage: () => image.animals(),
});
