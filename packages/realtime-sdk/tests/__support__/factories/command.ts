import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
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
  [Constants.PlatformType.ALEXA]: () => ({ ...commandPlatformDataFactory() }),
  [Constants.PlatformType.GENERAL]: () => ({ ...commandPlatformDataFactory() }),
  [Constants.PlatformType.GOOGLE]: () => ({ ...commandPlatformDataFactory() }),
  name: () => lorem.word(),
});
