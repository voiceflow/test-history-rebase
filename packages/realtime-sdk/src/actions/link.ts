import { LINK_KEY } from '../constants';
import { createAction, typeFactory } from './utils';

const linkType = typeFactory(LINK_KEY);

export const add = createAction<{ linkID: string; link: unknown }>(linkType('ADD'));
export const remove = createAction<{ linkID: string }>(linkType('REMOVE'));
export const updateData = createAction<{ linkID: string; data: unknown }>(linkType('UPDATE_DATA'));
