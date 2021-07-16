import { LINK_KEY } from '../constants';
import { LinkPayload } from '../types';
import { createAction, typeFactory } from './utils';

const linkType = typeFactory(LINK_KEY);

export const add = createAction<LinkPayload<{ link: unknown }>>(linkType('ADD'));
export const remove = createAction<LinkPayload>(linkType('REMOVE'));
export const updateData = createAction<LinkPayload<{ data: unknown }>>(linkType('UPDATE_DATA'));
