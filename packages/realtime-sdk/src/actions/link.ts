import { Utils } from '@voiceflow/common';

import { LINK_KEY } from '../constants';
import { BaseLinkPayload } from '../types';

const linkType = Utils.protocol.typeFactory(LINK_KEY);

export interface AddPayload extends BaseLinkPayload {
  link: unknown;
}

export interface UpdateDataPayload extends BaseLinkPayload {
  data: unknown;
}

export const add = Utils.protocol.createAction<AddPayload>(linkType('ADD'));
export const remove = Utils.protocol.createAction<BaseLinkPayload>(linkType('REMOVE'));
export const updateData = Utils.protocol.createAction<UpdateDataPayload>(linkType('UPDATE_DATA'));
