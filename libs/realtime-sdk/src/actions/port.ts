import { PORT_KEY } from '@realtime-sdk/constants';
import { BaseDiagramPayload, BaseNodePayload, BasePortPayload, RemoveNode } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';

const portType = Utils.protocol.typeFactory(PORT_KEY);

export interface AddDynamicPayload extends BasePortPayload {
  label: Nullish<string>;
  index?: number;
}

export interface RemoveDynamicPayload extends BasePortPayload {
  removeNodes: RemoveNode[];
}

export interface ReorderDynamicPayload extends BasePortPayload {
  index: number;
}

export interface AddByKeyPayload extends BasePortPayload {
  key: string;
  label?: Nullish<string>;
}

export interface AddBuiltinPayload extends BasePortPayload {
  type: BaseModels.PortType;
}

export interface RemoveBuiltinPayload extends BasePortPayload {
  type: BaseModels.PortType;
  removeNodes: RemoveNode[];
}

export interface RemoveManyByKeyPayload extends BaseNodePayload {
  keys: string[];
  removeNodes: RemoveNode[];
}

export interface SyncCustomBlockPortsPayload extends BaseDiagramPayload {
  patchData: {
    [nodeID: string]: { portID: string; label: string }[];
  };
}

export const addByKey = Utils.protocol.createAction<AddByKeyPayload>(portType('ADD_BY_KEY'));
export const addBuiltin = Utils.protocol.createAction<AddBuiltinPayload>(portType('ADD_BUILTIN'));
export const addDynamic = Utils.protocol.createAction<AddDynamicPayload>(portType('ADD_DYNAMIC'));
export const removeDynamic = Utils.protocol.createAction<RemoveDynamicPayload>(portType('REMOVE_DYNAMIC'));
export const removeBuiltin = Utils.protocol.createAction<RemoveBuiltinPayload>(portType('REMOVE_BUILTIN'));
export const reorderDynamic = Utils.protocol.createAction<ReorderDynamicPayload>(portType('REORDER_DYNAMIC'));
export const removeManyByKey = Utils.protocol.createAction<RemoveManyByKeyPayload>(portType('REMOVE_MANY_BY_KEY'));
export const syncCustomBlockPorts = Utils.protocol.createAction<SyncCustomBlockPortsPayload>(portType('SYNC_CUSTOM_BLOCK_PORTS'));
export const undoSyncCustomBlockPorts = Utils.protocol.createAction<SyncCustomBlockPortsPayload>(portType('UNDO_SYNC_CUSTOM_BLOCK_PORTS'));
