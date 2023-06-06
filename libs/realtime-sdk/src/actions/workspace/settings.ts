import { WORKSPACE_SETTINGS_KEY } from '@realtime-sdk/constants';
import { WorkspaceSettings } from '@realtime-sdk/models';
import { BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { workspaceType } from './utils';

const workspaceSettingsType = Utils.protocol.typeFactory(workspaceType(WORKSPACE_SETTINGS_KEY));

export interface PatchWorkspaceSettingsPayload extends BaseWorkspacePayload {
  settings: Partial<WorkspaceSettings>;
}

export interface ReplaceWorkspaceSettingsPayload extends BaseWorkspacePayload {
  settings: WorkspaceSettings;
}

export const patch = Utils.protocol.createAction<PatchWorkspaceSettingsPayload>(workspaceSettingsType('PATCH'));

export const replace = Utils.protocol.createAction<ReplaceWorkspaceSettingsPayload>(workspaceSettingsType('REPLACE'));
