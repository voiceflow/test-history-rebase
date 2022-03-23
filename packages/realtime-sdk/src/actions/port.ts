import { PORT_KEY } from '@realtime-sdk/constants';
import { BasePortPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const portType = Utils.protocol.typeFactory(PORT_KEY);

export interface AddDynamicPayload extends BasePortPayload {
  label: Nullish<string>;
}

export interface BuiltinOffset {
  /**
   * used when applying this change to mongo
   * we need to account for the number of builtin ports that currently exist
   */
  builtinOffset: number;
}

export interface ReorderDynamicPayload extends BasePortPayload, BuiltinOffset {
  index: number;
}

export interface AddBuiltinPayload extends BasePortPayload, BuiltinOffset {
  type: BaseModels.PortType;
  platform: Nullish<VoiceflowConstants.PlatformType>;
}

export const addDynamic = Utils.protocol.createAction<AddDynamicPayload>(portType('ADD_DYNAMIC'));
export const addBuiltin = Utils.protocol.createAction<AddBuiltinPayload>(portType('ADD_BUILTIN'));
export const reorderDynamic = Utils.protocol.createAction<ReorderDynamicPayload>(portType('REORDER_DYNAMIC'));
export const removeDynamic = Utils.protocol.createAction<BasePortPayload>(portType('REMOVE_DYNAMIC'));
export const removeBuiltin = Utils.protocol.createAction<BasePortPayload>(portType('REMOVE_BUILTIN'));
