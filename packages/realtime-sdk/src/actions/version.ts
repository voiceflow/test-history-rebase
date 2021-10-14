import { PUBLISHING_KEY, RPC_KEY, SESSION_KEY, SETTINGS_KEY, VARIABLES_KEY, VERSION_KEY } from '../constants';
import { AnyVersion, AnyVersionPublishing, AnyVersionSettings, Version } from '../models';
import { BaseProjectPayload, BaseVersionPayload } from '../types';
import { createAction, createCRUDActions, typeFactory } from './utils';

const versionType = typeFactory(VERSION_KEY);
const versionRPCType = typeFactory(versionType(RPC_KEY));
const versionVariablesType = typeFactory(versionType(VARIABLES_KEY));
const versionSettingsType = typeFactory(versionType(SETTINGS_KEY));
const versionSessionType = typeFactory(versionSettingsType(SESSION_KEY));
const versionPublishingType = typeFactory(versionType(PUBLISHING_KEY));

// RPC

export interface ActivateVersionPayload {
  workspaceID: string;
  projectID: string;
  versionID: string;
  diagramID: string | null;
}

export const activateVersion = createAction<ActivateVersionPayload>(versionRPCType('ACTIVATE'));

// Variables

export interface GlobalVariablePayload extends BaseVersionPayload {
  variable: string;
}

export const addGlobalVariable = createAction<GlobalVariablePayload>(versionVariablesType('ADD'));

export const removeGlobalVariable = createAction<GlobalVariablePayload>(versionVariablesType('REMOVE'));

// Other

export interface PatchSettingsPayload extends BaseVersionPayload {
  settings: Partial<AnyVersionSettings>;
}

export interface PatchSessionPayload extends BaseVersionPayload {
  session: Partial<Version.Session>;
}

export interface PatchPublishingPayload extends BaseVersionPayload {
  publishing: Partial<AnyVersionPublishing>;
}

export const patchSettings = createAction<PatchSettingsPayload>(versionSettingsType('PATCH'));

export const patchSession = createAction<PatchSessionPayload>(versionSessionType('PATCH'));

export const patchPublishing = createAction<PatchPublishingPayload>(versionPublishingType('PATCH'));

export const crud = createCRUDActions<BaseProjectPayload, AnyVersion>(versionType);
