import { BaseModels, Models } from '@voiceflow/base-types';
import { Struct } from '@voiceflow/common';
import { ObjectId, OptionalId } from 'mongodb';

import { Atomic } from '../utils';

export interface DiagramType {
  _id: ObjectId;

  name: string;
  versionID: ObjectId;
  creatorID: number;
  modified: number;
  variables: string[]; // local (flow) variables
  children: string[];

  offsetX: number;
  offsetY: number;
  zoom: number;
  nodes: Record<string, Models.BaseDiagramNode>;
}

export type DiagramData = Omit<OptionalId<DiagramType>, 'versionID'> & { versionID: string };

export type PublicDiagramData = Omit<DiagramData, '_id' | 'creatorID' | 'versionID'>;

export type DiagramUpdateData = PublicDiagramData & { _id: string };

export interface ManyNodeDataUpdate extends Atomic.Update {
  nodeID: string;
}

export interface ByKeyLinkPatch {
  nodeID: string;
  portID?: never;
  type?: never;
  key: string;
  data: Struct;
}

export interface BuiltInLinkPatch {
  nodeID: string;
  portID?: never;
  type: BaseModels.PortType;
  key?: never;
  data: Struct;
}

export interface DynamicLinkPatch {
  nodeID: string;
  portID: string;
  type?: never;
  key?: never;
  data: Struct;
}

export type LinkPatch = ByKeyLinkPatch | BuiltInLinkPatch | DynamicLinkPatch;

export interface ByKeyLinkDelete {
  nodeID: string;
  portID?: never;
  type?: never;
  key: string;
}

export interface BuiltInLinkDelete {
  nodeID: string;
  portID?: never;
  type: BaseModels.PortType;
  key?: never;
}

export interface DynamicLinkDelete {
  nodeID: string;
  portID: string;
  type?: never;
  key?: never;
}

export interface ByKeyPortDelete {
  portID?: never;
  key: string;
  type?: never;
}

export interface DynamicPortDelete {
  portID: string;
  key?: never;
  type?: never;
}

export interface BuiltInPortDelete {
  portID?: never;
  key?: never;
  type: BaseModels.PortType;
}

export type PortDelete = ByKeyPortDelete | DynamicPortDelete | BuiltInPortDelete;

export type LinkDelete = ByKeyLinkDelete | BuiltInLinkDelete | DynamicLinkDelete;

export interface NodePortRemap {
  nodeID: string;
  ports: PortDelete[];
  targetNodeID: string | null;
}
