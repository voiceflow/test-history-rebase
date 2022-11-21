import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

export const CommandStepData = define<BaseNode.Command.StepData>({
  name: () => lorem.word(),
  ports: () => [{ type: lorem.word(), target: datatype.uuid(), id: datatype.uuid() }],
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
  diagramID: () => datatype.uuid(),
});

export const CommandPlatformData = define<NodeData.Command.PlatformData>({
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
  diagramID: () => datatype.uuid(),
});

export const CommandNodeData = define<NodeData.Command>({
  ...CommandPlatformData({ intent: null, diagramID: null, mappings: [] }),
  name: () => lorem.word(),
});
