import { Utils } from '@voiceflow/common';

import type { WorkspaceAction } from '../workspace.action';
import { workspaceAction } from '../workspace.action';
import type { WorkspaceQuotaName } from './workspace-quota.enum';
import type { WorkspaceQuota } from './workspace-quota.interface';

const workspaceQuotaType = Utils.protocol.typeFactory(workspaceAction('quota'));

export interface Replace extends WorkspaceAction {
  quotas: WorkspaceQuota[];
}

export const Replace = Utils.protocol.createAction<Replace>(workspaceQuotaType('REPLACE'));

export interface Refresh extends WorkspaceAction {
  quotaName: WorkspaceQuotaName;
}

export const Refresh = Utils.protocol.createAction<Refresh>(workspaceQuotaType('REFRESH'));

export interface Update extends WorkspaceAction {
  quota: WorkspaceQuota;
}

export const Update = Utils.protocol.createAction<Update>(workspaceQuotaType('UPDATE'));
