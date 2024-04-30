import type { BaseModels } from '@voiceflow/base-types';

import type { BlockType } from '@/constants';

import type { Port } from './Port';
import type { PartialModel } from './Utility';

export type BuiltInPortRecord<T = string> = { [key in BaseModels.PortType]?: T };

export interface NodeOutPortSchema<T, O extends BuiltInPortRecord<T> = BuiltInPortRecord<T>> {
  byKey: Record<string, T>;
  dynamic: T[];
  builtIn: O;
}

export interface NodePortSchema<T, O extends BuiltInPortRecord<T> = BuiltInPortRecord<T>> {
  in: T[];
  out: NodeOutPortSchema<T, O>;
}

export type NodePorts<O extends BuiltInPortRecord = BuiltInPortRecord> = NodePortSchema<string, O>;

export type PortDescriptor = Omit<PartialModel<Port>, 'nodeID'>;

export type PortsDescriptor<O extends BuiltInPortRecord<PortDescriptor> = BuiltInPortRecord<PortDescriptor>> =
  NodePortSchema<Omit<PartialModel<Port>, 'nodeID'>, O>;

export interface Node<O extends BuiltInPortRecord = BuiltInPortRecord> {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  ports: NodePorts<O>;
  parentNode: string | null;
  combinedNodes: string[];
  blockColor?: string | null;
}

export type DBNodeStart = Omit<BaseModels.BaseBlock, 'type'> & { type: BlockType.START };
