import { QUOTAS_KEY } from '@realtime-sdk/constants';
import { Quota } from '@realtime-sdk/models';
import { BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { workspaceType } from './utils';

const quotasType = Utils.protocol.typeFactory(workspaceType(QUOTAS_KEY));

export interface RefreshQuotaDetailsPayload extends BaseWorkspacePayload {
  quotaName: string;
}

export interface replaceQuotaPayload extends BaseWorkspacePayload {
  quotaDetails: Quota;
}

export interface LoadQuotasPayload extends BaseWorkspacePayload {
  quotas: Quota[];
}

export const loadAll = Utils.protocol.createAction<LoadQuotasPayload>(quotasType('LOAD_ALL_QUOTAS'));

export const replaceQuota = Utils.protocol.createAction<replaceQuotaPayload>(quotasType('REPLACE_QUOTA_CONSUMED'));

export const refreshQuotaDetails = Utils.protocol.createAction<RefreshQuotaDetailsPayload>(quotasType('REFRESH_QUOTA_DETAILS'));
