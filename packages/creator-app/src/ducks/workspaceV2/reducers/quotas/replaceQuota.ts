import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const replaceQuota = createReducer(Realtime.workspace.quotas.replaceQuota, (state, { workspaceID, quotaDetails }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace?.quotas) return;

  const quotaIndex = workspace.quotas.findIndex((q) => q.quotaDetails.name === quotaDetails.quotaDetails.name);

  workspace.quotas[quotaIndex] = quotaDetails;
});

export default replaceQuota;
