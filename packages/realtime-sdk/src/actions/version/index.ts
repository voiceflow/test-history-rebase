import { COMPONENTS_KEY, DEFAULT_STEP_COLORS_KEY, PROTOTYPE_KEY, PUBLISHING_KEY, RPC_KEY, SESSION_KEY, SETTINGS_KEY } from '@realtime-sdk/constants';
import { AnyVersion, AnyVersionPublishing, AnyVersionSettings, PrototypeSettings, Version } from '@realtime-sdk/models';
import { BaseProjectPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';

import { createCRUDActions } from '../utils';
import { versionType } from './utils';

export * as schema from './schema';
export * as variable from './variable';

const versionRPCType = Utils.protocol.typeFactory(versionType(RPC_KEY));
const versionSettingsType = Utils.protocol.typeFactory(versionType(SETTINGS_KEY));
const versionDefaultStepColorsType = Utils.protocol.typeFactory(versionType(DEFAULT_STEP_COLORS_KEY));
const versionSessionType = Utils.protocol.typeFactory(versionSettingsType(SESSION_KEY));
const versionPublishingType = Utils.protocol.typeFactory(versionType(PUBLISHING_KEY));
const versionPrototypeType = Utils.protocol.typeFactory(versionType(PROTOTYPE_KEY));
const componentsType = Utils.protocol.typeFactory(versionType(COMPONENTS_KEY));

// RPC

export interface ActivateVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  projectID: string;
  versionID: string;
  workspaceID: string;
}

export const activateVersion = Utils.protocol.createAction<ActivateVersionPayload>(versionRPCType('ACTIVATE'));

// Other

export interface PatchSettingsPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  settings: Partial<AnyVersionSettings>;
}

export interface PatchDefaultStepColorsPayload extends BaseVersionPayload {
  defaultStepColors: Version.DefaultStepColors;
}

export interface PatchSessionPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  session: Partial<Version.Session>;
  platform: Platform.Constants.PlatformType;
}

export interface PatchPublishingPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  publishing: Partial<AnyVersionPublishing>;
}

export interface ReorderTopicsPayload extends BaseVersionPayload {
  toIndex: number;
  fromID: string;
}

export interface ReorderComponentsPayload extends BaseVersionPayload {
  toIndex: number;
  fromID: string;
}

export interface ReplacePrototypeSettingsPayload extends BaseVersionPayload {
  settings: PrototypeSettings;
}

export interface ReloadFoldersPayload extends BaseVersionPayload {
  folders: NonNullable<AnyVersion['folders']>;
}

export interface AddManyComponentsPayload extends BaseVersionPayload {
  components: NonNullable<AnyVersion['components']>;
}

export const patchSettings = Utils.protocol.createAction<PatchSettingsPayload>(versionSettingsType('PATCH'));

export const patchDefaultStepColors = Utils.protocol.createAction<PatchDefaultStepColorsPayload>(versionDefaultStepColorsType('PATCH'));

export const patchSession = Utils.protocol.createAction<PatchSessionPayload>(versionSessionType('PATCH'));

export const reloadFolders = Utils.protocol.createAction<ReloadFoldersPayload>(versionType('RELOAD_FOLDERS'));

export const patchPublishing = Utils.protocol.createAction<PatchPublishingPayload>(versionPublishingType('PATCH'));

export const addManyComponents = Utils.protocol.createAction<AddManyComponentsPayload>(componentsType('ADD_MANY'));

export const reorderComponents = Utils.protocol.createAction<ReorderComponentsPayload>(componentsType('REORDER'));

export const replacePrototypeSettings = Utils.protocol.createAction<ReplacePrototypeSettingsPayload>(versionPrototypeType('REPLACE_SETTINGS'));

export const crud = createCRUDActions<AnyVersion, BaseProjectPayload>(versionType);
