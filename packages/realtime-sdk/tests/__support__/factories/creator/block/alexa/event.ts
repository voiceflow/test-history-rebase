import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const EventMapping = define<Node.Event.Mapping>({
  var: () => lorem.word(),
  path: () => datatype.uuid(),
});

export const EventStepData = define<Node.Event.StepData>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => lorem.word(),
});

export const EventNodeData = define<NodeData.Event>({
  mappings: () => [EventMapping(), EventMapping()],
  requestName: () => lorem.word(),
});
