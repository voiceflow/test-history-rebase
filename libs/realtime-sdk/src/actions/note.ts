import { NOTE_KEY } from '@realtime-sdk/constants';
import { Note } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const noteType = Utils.protocol.typeFactory(NOTE_KEY);

export interface LoadPayload extends BaseVersionPayload {
  notes: Note[];
}

export interface UpsertPayload extends BaseVersionPayload {
  note: Note;
}

export interface RemovePayload extends BaseVersionPayload {
  noteID: string;
}

export interface AddManyPayload extends BaseVersionPayload {
  values: Note[];
}

export interface RemoveManyPayload extends BaseVersionPayload {
  noteIDs: string[];
}

export const load = Utils.protocol.createAction<LoadPayload>(noteType('LOAD'));
export const upsert = Utils.protocol.createAction<UpsertPayload>(noteType('UPSERT'));
export const remove = Utils.protocol.createAction<RemovePayload>(noteType('REMOVE'));
export const addMany = Utils.protocol.createAction<AddManyPayload>(noteType('ADD_MANY'));
export const removeMany = Utils.protocol.createAction<RemoveManyPayload>(noteType('REMOVE_MANY'));
