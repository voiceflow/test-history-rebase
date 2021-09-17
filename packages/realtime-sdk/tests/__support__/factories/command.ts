import { Node } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const commandPlatformDataFactory = define<NodeData.Command.PlatformData>({
  diagramID: () => datatype.uuid(),
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const commandStepDataFactory = define<Node.Command.StepData>({
  diagramID: () => datatype.uuid(),
  intent: () => lorem.word(),
  name: () => lorem.word(),
  ports: () => [{ type: lorem.word(), target: datatype.uuid(), id: datatype.uuid() }],
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});

export const commandNodeDataFactory = define<NodeData.Command>({
  [PlatformType.ALEXA]: () => ({ ...commandPlatformDataFactory() }),
  [PlatformType.GENERAL]: () => ({ ...commandPlatformDataFactory() }),
  [PlatformType.GOOGLE]: () => ({ ...commandPlatformDataFactory() }),
  name: () => lorem.word(),
});
