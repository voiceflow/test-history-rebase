import { COMPONENTS_KEY, PUBLISHING_KEY, RPC_KEY, SESSION_KEY, SETTINGS_KEY, TOPICS_KEY, VARIABLES_KEY, VERSION_KEY } from '@realtime-sdk/constants';
import { AnyVersion, AnyVersionPublishing, AnyVersionSettings, Version } from '@realtime-sdk/models';
import { BaseProjectPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const versionType = Utils.protocol.typeFactory(VERSION_KEY);
const versionRPCType = Utils.protocol.typeFactory(versionType(RPC_KEY));
const versionVariablesType = Utils.protocol.typeFactory(versionType(VARIABLES_KEY));
const versionSettingsType = Utils.protocol.typeFactory(versionType(SETTINGS_KEY));
const versionSessionType = Utils.protocol.typeFactory(versionSettingsType(SESSION_KEY));
const versionPublishingType = Utils.protocol.typeFactory(versionType(PUBLISHING_KEY));
const topicsType = Utils.protocol.typeFactory(versionType(TOPICS_KEY));
const componentsType = Utils.protocol.typeFactory(versionType(COMPONENTS_KEY));

// RPC

export interface ActivateVersionPayload {
  workspaceID: string;
  projectID: string;
  versionID: string;
  diagramID: string | null;
}

export const activateVersion = Utils.protocol.createAction<ActivateVersionPayload>(versionRPCType('ACTIVATE'));

// Variables

export interface GlobalVariablePayload extends BaseVersionPayload {
  variable: string;
}

export const addGlobalVariable = Utils.protocol.createAction<GlobalVariablePayload>(versionVariablesType('ADD'));

export const removeGlobalVariable = Utils.protocol.createAction<GlobalVariablePayload>(versionVariablesType('REMOVE'));

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

export interface ReorderTopicsPayload extends BaseVersionPayload {
  to: number;
  from: number;
}

export interface ReorderComponentsPayload extends BaseVersionPayload {
  to: number;
  from: number;
}

export const patchSettings = Utils.protocol.createAction<PatchSettingsPayload>(versionSettingsType('PATCH'));

export const patchSession = Utils.protocol.createAction<PatchSessionPayload>(versionSessionType('PATCH'));

export const patchPublishing = Utils.protocol.createAction<PatchPublishingPayload>(versionPublishingType('PATCH'));

export const reorderTopics = Utils.protocol.createAction<ReorderTopicsPayload>(topicsType('REORDER'));

export const reorderComponents = Utils.protocol.createAction<ReorderComponentsPayload>(componentsType('REORDER'));

export const crud = createCRUDActions<BaseProjectPayload, AnyVersion>(versionType);
