import { COMPONENTS_KEY, PUBLISHING_KEY, RPC_KEY, SESSION_KEY, SETTINGS_KEY, TOPICS_KEY } from '@realtime-sdk/constants';
import { AnyVersion, AnyVersionPublishing, AnyVersionSettings, Version } from '@realtime-sdk/models';
import { BaseProjectPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createCRUDActions } from '../utils';
import { versionType } from './utils';

export * as schema from './schema';
export * as variable from './variable';

const versionRPCType = Utils.protocol.typeFactory(versionType(RPC_KEY));
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
  projectType: VoiceflowConstants.ProjectType;
}

export const activateVersion = Utils.protocol.createAction<ActivateVersionPayload>(versionRPCType('ACTIVATE'));

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
  toIndex: number;
  fromID: string;
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

export const crud = createCRUDActions<AnyVersion, BaseProjectPayload>(versionType);
