import { WORKSPACE_SETTINGS_KEY } from '@realtime-sdk/constants';
import type { WorkspaceSettings } from '@realtime-sdk/models';
import type { BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { workspaceType } from './utils';

const workspaceSettingsType = Utils.protocol.typeFactory(workspaceType(WORKSPACE_SETTINGS_KEY));

export interface PatchWorkspaceSettingsPayload extends BaseWorkspacePayload {
  settings: Partial<WorkspaceSettings>;
}

export interface ToggleDashboardKanbanPayload extends BaseWorkspacePayload {
  enabled: boolean;
}

export interface ReplaceWorkspaceSettingsPayload extends BaseWorkspacePayload {
  settings: WorkspaceSettings;
}

export const patch = Utils.protocol.createAction<PatchWorkspaceSettingsPayload>(workspaceSettingsType('PATCH'));

export const toggleDashboardKanban = Utils.protocol.createAction<ToggleDashboardKanbanPayload>(
  workspaceSettingsType('TOGGLE_DASHBOARD_KANBAN')
);

export const replace = Utils.protocol.createAction<ReplaceWorkspaceSettingsPayload>(workspaceSettingsType('REPLACE'));
