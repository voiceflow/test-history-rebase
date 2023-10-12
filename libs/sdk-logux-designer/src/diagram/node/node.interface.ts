import type { Port } from '../port/port.interface';
import type { PortType } from '../port/port-type.enum';
import type { NodeType } from './node-type.enum';

export interface Node<Type extends NodeType, Data> {
  id: string;
  type: Type;
  data: Data;
}

export namespace Node {
  export interface Child {
    parentID: string;
  }

  export interface Coordinates {
    coords: [x: number, y: number];
  }

  export interface Ports<Ports extends Record<string, Port> | null = null> {
    ports: Ports;
  }

  export type PortsWithNext = Record<PortType.NEXT, Port>;

  export type PortsByKey = Record<string, Port>;
}
