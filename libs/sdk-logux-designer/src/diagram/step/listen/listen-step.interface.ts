import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';
import type { Port } from '@/diagram/port/port.interface';
import type { PortType } from '@/diagram/port/port-type.enum';

import type { Step } from '../step.interface';
import type { ButtonListenData, EntityListenData, IntentListenData, RawListenData } from './listen-data.interface';

export interface ListenStep extends Step<NodeType.STEP__LISTEN__V3, ListenStep.Data, ListenStep.Ports> {}

export namespace ListenStep {
  export type Data = ButtonListenData | IntentListenData | EntityListenData | RawListenData;

  export interface Ports extends Node.PortsWithNext, Node.PortsByKey {
    [PortType.EXIT]: Port;
    [PortType.NO_MATCH]: Port;
    [PortType.NO_REPLY]: Port;
  }
}
