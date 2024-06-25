import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const EventMapping = define<AlexaNode.Event.Mapping>({
  var: () => faker.lorem.word(),
  path: () => faker.datatype.uuid(),
});

export const EventStepData = define<AlexaNode.Event.StepData>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => faker.lorem.word(),
});

export const EventNodeData = define<NodeData.Event>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => faker.lorem.word(),
});
