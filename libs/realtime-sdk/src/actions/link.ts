import { LINK_KEY } from '@realtime-sdk/constants';
import type { LinkData } from '@realtime-sdk/models';
import type { BaseDiagramPayload, BaseLinkPayload } from '@realtime-sdk/types';
import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

const linkType = Utils.protocol.typeFactory(LINK_KEY);

export interface AddDynamicPayload extends BaseLinkPayload {
  sourceParentNodeID: string | null;
  sourceNodeID: string;
  sourcePortID: string;
  targetNodeID: string;
  targetPortID: string;
  data?: LinkData;
}

export interface AddBuiltinPayload extends AddDynamicPayload {
  type: BaseModels.PortType;
}

export interface AddByKeyPayload extends AddDynamicPayload {
  key: string;
}

export interface RemoveManyPayload extends BaseDiagramPayload {
  links: { nodeID: string; portID: string; linkID: string; type?: BaseModels.PortType; key?: string }[];
}

export interface LinkPatch {
  nodeID: string;
  portID: string;
  linkID: string;
  data: Partial<LinkData>;
  type?: BaseModels.PortType;
  key?: string;
}

export interface PatchManyPayload extends BaseDiagramPayload {
  patches: LinkPatch[];
}

export const addBuiltin = Utils.protocol.createAction<AddBuiltinPayload>(linkType('ADD_BUILT_IN'));
export const addDynamic = Utils.protocol.createAction<AddDynamicPayload>(linkType('ADD_DYNAMIC'));
export const addByKey = Utils.protocol.createAction<AddByKeyPayload>(linkType('ADD_BY_KEY'));
export const removeMany = Utils.protocol.createAction<RemoveManyPayload>(linkType('REMOVE_MANY'));
export const patchMany = Utils.protocol.createAction<PatchManyPayload>(linkType('PATCH_MANY'));
