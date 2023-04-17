import { CUSTOM_BLOCK_KEY } from '@realtime-sdk/constants';
import { CustomBlock } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const { createAsyncAction, createAction } = Utils.protocol;

const customBlockType = Utils.protocol.typeFactory(CUSTOM_BLOCK_KEY);

export const crud = createCRUDActions<CustomBlock, BaseVersionPayload>(customBlockType);

export type CreatePayload = Omit<CustomBlock, 'id'> & BaseVersionPayload;
export const create = createAsyncAction<CreatePayload, CustomBlock>(customBlockType('CREATE'));

export type RemovePayload = Pick<CustomBlock, 'id'> & BaseVersionPayload;
export const remove = createAction<RemovePayload>(customBlockType('REMOVE'));

export type UpdatePayload = CustomBlock & BaseVersionPayload;
export const update = createAsyncAction<UpdatePayload, CustomBlock>(customBlockType('UPDATE'));
