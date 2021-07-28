import { LINK_KEY } from '../constants';
import { BaseLinkPayload } from '../types';
import { createAction, typeFactory } from './utils';

const linkType = typeFactory(LINK_KEY);

export interface AddPayload extends BaseLinkPayload {
  link: unknown;
}

export interface UpdateDataPayload extends BaseLinkPayload {
  data: unknown;
}

export const add = createAction<AddPayload>(linkType('ADD'));
export const remove = createAction<BaseLinkPayload>(linkType('REMOVE'));
export const updateData = createAction<UpdateDataPayload>(linkType('UPDATE_DATA'));
