import { PORT_KEY } from '@realtime-sdk/constants';
import { BaseNodePayload, BasePortPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';

const portType = Utils.protocol.typeFactory(PORT_KEY);

export interface AddDynamicPayload extends BasePortPayload {
  label: Nullish<string>;
  index?: number;
}

export interface ReorderDynamicPayload extends BasePortPayload {
  index: number;
}

export interface AddByKeyPayload extends BasePortPayload {
  key: string;
  label?: Nullish<string>;
}

export interface BuiltinPayload extends BasePortPayload {
  type: BaseModels.PortType;
}

export interface RemoveByKeyPayload extends BasePortPayload {
  key: string;
}

export interface RemoveManyByKeyPayload extends BaseNodePayload {
  keys: string[];
}

export const addDynamic = Utils.protocol.createAction<AddDynamicPayload>(portType('ADD_DYNAMIC'));
export const addBuiltin = Utils.protocol.createAction<BuiltinPayload>(portType('ADD_BUILTIN'));
export const addByKey = Utils.protocol.createAction<AddByKeyPayload>(portType('ADD_BY_KEY'));
export const reorderDynamic = Utils.protocol.createAction<ReorderDynamicPayload>(portType('REORDER_DYNAMIC'));
export const removeDynamic = Utils.protocol.createAction<BasePortPayload>(portType('REMOVE_DYNAMIC'));
export const removeBuiltin = Utils.protocol.createAction<BuiltinPayload>(portType('REMOVE_BUILTIN'));
export const removeByKey = Utils.protocol.createAction<RemoveByKeyPayload>(portType('REMOVE_BY_KEY'));
export const removeManyByKey = Utils.protocol.createAction<RemoveManyByKeyPayload>(portType('REMOVE_MANY_BY_KEY'));
