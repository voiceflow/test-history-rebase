import { WithRequired } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Overwrite } from 'utility-types';

export type NodeDescriptor = Overwrite<Realtime.Node, { ports: Realtime.PortsDescriptor }>;

export type ParentNodeDescriptor = WithRequired<Partial<NodeDescriptor>, 'id' | 'ports'>;

export type DataDescriptor<T = unknown> = Omit<Realtime.NodeData<T>, 'nodeID' | 'type' | 'blockColor' | 'path'>;
