import { PORT_KEY } from '@realtime-sdk/constants';
import { BasePortPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';

const portType = Utils.protocol.typeFactory(PORT_KEY);

export interface AddDynamicPayload extends BasePortPayload {
  label: Nullish<string>;
}

export interface ReorderDynamicPayload extends BasePortPayload {
  index: number;
}

export interface AddBuiltinPayload extends BasePortPayload {
  type: BaseModels.PortType;
}

export interface RemoveBuiltinPayload extends BasePortPayload {
  type: BaseModels.PortType;
}

export const addDynamic = Utils.protocol.createAction<AddDynamicPayload>(portType('ADD_DYNAMIC'));
export const addBuiltin = Utils.protocol.createAction<AddBuiltinPayload>(portType('ADD_BUILTIN'));
export const reorderDynamic = Utils.protocol.createAction<ReorderDynamicPayload>(portType('REORDER_DYNAMIC'));
export const removeDynamic = Utils.protocol.createAction<BasePortPayload>(portType('REMOVE_DYNAMIC'));
export const removeBuiltin = Utils.protocol.createAction<RemoveBuiltinPayload>(portType('REMOVE_BUILTIN'));
