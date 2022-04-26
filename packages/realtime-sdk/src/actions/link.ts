import { LINK_KEY } from '@realtime-sdk/constants';
import { LinkData } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseLinkPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const linkType = Utils.protocol.typeFactory(LINK_KEY);

export interface AddPayload extends BaseLinkPayload {
  sourceNodeID: string;
  sourcePortID: string;
  targetNodeID: string;
  targetPortID: string;
  data?: LinkData;
}

export interface RemoveManyPayload extends BaseDiagramPayload {
  links: { nodeID: string; portID: string; linkID: string }[];
}

export interface LinkPatch {
  nodeID: string;
  portID: string;
  linkID: string;
  data: Partial<LinkData>;
}

export interface PatchManyPayload extends BaseDiagramPayload {
  patches: LinkPatch[];
}

export const add = Utils.protocol.createAction<AddPayload>(linkType('ADD'));
export const removeMany = Utils.protocol.createAction<RemoveManyPayload>(linkType('REMOVE_MANY'));
export const patchMany = Utils.protocol.createAction<PatchManyPayload>(linkType('PATCH_MANY'));
