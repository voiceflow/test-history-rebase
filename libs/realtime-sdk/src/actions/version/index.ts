import {
  DEFAULT_STEP_COLORS_KEY,
  PROTOTYPE_KEY,
  PUBLISHING_KEY,
  RPC_KEY,
  SESSION_KEY,
  SETTINGS_KEY,
} from '@realtime-sdk/constants';
import type { PrototypeSettings } from '@realtime-sdk/models';
import type { BaseProjectPayload, BaseVersionPayload } from '@realtime-sdk/types';
import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config/backend';

import { createCRUDActions } from '../utils';
import { versionType } from './utils';

export * as schema from './schema';

const versionRPCType = Utils.protocol.typeFactory(versionType(RPC_KEY));
const versionSettingsType = Utils.protocol.typeFactory(versionType(SETTINGS_KEY));
const versionSessionType = Utils.protocol.typeFactory(versionSettingsType(SESSION_KEY));
const versionPrototypeType = Utils.protocol.typeFactory(versionType(PROTOTYPE_KEY));
const versionPublishingType = Utils.protocol.typeFactory(versionType(PUBLISHING_KEY));
const versionDefaultStepColorsType = Utils.protocol.typeFactory(versionType(DEFAULT_STEP_COLORS_KEY));

// RPC

export interface ActivateVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  projectID: string;
  versionID: string;
  workspaceID: string;
}

/**
 * @deprecated should be removed with HTTP_LOAD_ENVIRONMENT feature flag
 */
export const activateVersion = Utils.protocol.createAction<ActivateVersionPayload>(versionRPCType('ACTIVATE'));

// Other

export interface PatchSettingsPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  settings: Partial<Platform.Base.Models.Version.Settings.Model>;
  defaultVoice: string;
}

export interface PatchDefaultStepColorsPayload extends BaseVersionPayload {
  defaultStepColors: BaseModels.Version.DefaultStepColors;
}

export interface PatchSessionPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  session: Partial<Platform.Base.Models.Version.Session>;
  platform: Platform.Constants.PlatformType;
  defaultVoice: string;
}

export interface PatchPublishingPayload extends BaseVersionPayload {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
  publishing: Partial<Platform.Base.Models.Version.Publishing.Model>;
  defaultVoice: string;
}

export interface ReplacePrototypeSettingsPayload extends BaseVersionPayload {
  settings: PrototypeSettings;
}

export interface CreateBackupPayload extends BaseVersionPayload {
  name: string;
}

export const crud = createCRUDActions<Platform.Base.Models.Version.Model, BaseProjectPayload>(versionType);

export const patchSession = Utils.protocol.createAction<PatchSessionPayload>(versionSessionType('PATCH'));

export const patchSettings = Utils.protocol.createAction<PatchSettingsPayload>(versionSettingsType('PATCH'));

export const patchPublishing = Utils.protocol.createAction<PatchPublishingPayload>(versionPublishingType('PATCH'));

export const patchDefaultStepColors = Utils.protocol.createAction<PatchDefaultStepColorsPayload>(
  versionDefaultStepColorsType('PATCH')
);

export const replacePrototypeSettings = Utils.protocol.createAction<ReplacePrototypeSettingsPayload>(
  versionPrototypeType('REPLACE_SETTINGS')
);

export const createBackup = Utils.protocol.createAction<CreateBackupPayload>(versionType('CREATE_BACKUP'));
