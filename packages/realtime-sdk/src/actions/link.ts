import { LINK_KEY } from '@realtime-sdk/constants';
import { BaseLinkPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const linkType = Utils.protocol.typeFactory(LINK_KEY);

export interface AddPayload extends BaseLinkPayload {
  sourcePortID: string;
  targetPortID: string;
  linkID: string;
}

export const add = Utils.protocol.createAction<AddPayload>(linkType('ADD'));
export const remove = Utils.protocol.createAction<BaseLinkPayload>(linkType('REMOVE'));
