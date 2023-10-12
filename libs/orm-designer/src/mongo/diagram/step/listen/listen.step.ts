import { z } from 'zod';

import { NodePortsByKey, NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Port } from '../../port/port.dto';
import { PortType } from '../../port/port-type.enum';
import { Step } from '../step.dto';
import { ButtonListenData, EntityListenData, IntentListenData, RawListenData } from './listen-data.dto';

export const ListenPorts = z.intersection(
  NodePortsByKey,
  NodePortsWithNext.extend({
    [PortType.EXIT]: Port,
    [PortType.NO_MATCH]: Port,
    [PortType.NO_REPLY]: Port,
  })
);

export type ListenPorts = z.infer<typeof ListenPorts>;

export const ListenStepData = z.discriminatedUnion('type', [
  ButtonListenData,
  IntentListenData,
  EntityListenData,
  RawListenData,
]);

export type ListenStepData = z.infer<typeof ListenStepData>;

export const ListenStep = Step(NodeType.STEP__LISTEN__V3, ListenStepData, ListenPorts);

export type ListenStep = z.infer<typeof ListenStep>;
