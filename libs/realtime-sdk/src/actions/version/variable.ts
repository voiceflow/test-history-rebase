import { VARIABLES_KEY } from '@realtime-sdk/constants';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { versionType } from './utils';

const variablesType = Utils.protocol.typeFactory(versionType(VARIABLES_KEY));

export interface GlobalVariablePayload extends BaseVersionPayload {
  variable: string;
}

export interface GlobalManyVariablesPayload extends BaseVersionPayload {
  variables: string[];
}

export const addGlobal = Utils.protocol.createAction<GlobalVariablePayload>(variablesType('ADD'));

export const addManyGlobal = Utils.protocol.createAction<GlobalManyVariablesPayload>(variablesType('ADD_MANY'));

export const removeGlobal = Utils.protocol.createAction<GlobalVariablePayload>(variablesType('REMOVE'));

export const reloadGlobal = Utils.protocol.createAction<GlobalManyVariablesPayload>(variablesType('RELOAD'));

export const removeManyGlobal = Utils.protocol.createAction<GlobalManyVariablesPayload>(variablesType('REMOVE_MANY'));
