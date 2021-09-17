import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const eventMappingFactory = define<Node.Event.Mapping>({
  path: () => datatype.uuid(),
  var: () => lorem.word(),
});

export const eventStepDataFactory = define<Node.Event.StepData>({
  mappings: () => [eventMappingFactory(), eventMappingFactory()],
  requestName: () => lorem.word(),
});

export const eventNodeDataFactory = define<NodeData.Event>({
  mappings: () => [eventMappingFactory(), eventMappingFactory()],
  requestName: () => lorem.word(),
});
