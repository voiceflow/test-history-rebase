import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const EventMapping = define<AlexaNode.Event.Mapping>({
  var: () => lorem.word(),
  path: () => datatype.uuid(),
});

export const EventStepData = define<AlexaNode.Event.StepData>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => lorem.word(),
});

export const EventNodeData = define<NodeData.Event>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => lorem.word(),
});
